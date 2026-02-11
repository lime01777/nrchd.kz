import streamlit as st
import subprocess
import threading
import queue
import time
import os
from pathlib import Path
import re

# Page config
st.set_page_config(
    page_title="Protocol Analyzer v0.96",
    page_icon="💊",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .stButton>button {
        width: 100%;
        background-color: #4CAF50;
        color: white;
        height: 3em;
        font-weight: bold;
    }
    .stDownloadButton>button {
        width: 100%;
        background-color: #2196F3;
        color: white;
    }
    .reportview-container {
        background: #f0f2f6;
    }
    h1 {
        color: #2c3e50;
    }
    .stAlert {
        padding: 1rem;
        border-radius: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)

st.title("💊 Анализатор Клинических Протоколов")
st.markdown("Загрузите протокол (DOCX/PDF) и укажите нозологию для автоматического анализа доказательности.")

# Sidebar for configuration
with st.sidebar:
    st.header("⚙️ Настройки")
    
    indication = st.text_input("Показание (Нозология)", placeholder="Например: Пневмония", help="Основное заболевание, для которого проверяется эффективность препаратов.")
    
    max_workers = st.slider("Количество потоков", min_value=1, max_value=16, value=8, help="Больше потоков = быстрее анализ, но выше нагрузка на CPU.")
    
    safe_mode = st.checkbox("🛡️ Безопасный режим (меньше ошибок 429)", value=False, help="Ограничивает скорость запросов, чтобы избежать блокировок API (ошибка 429).")
    if safe_mode:
        max_workers = 2
        st.info("Включен безопасный режим: макс. 2 потока.")
        
    enable_critique = st.checkbox("🕵️ AI-Критик (Double Check)", value=True, help="Второй проход AI для проверки ошибок. Улучшает качество, но замедляет анализ.")
    
    st.markdown("---")
    st.caption("v0.96 (Web UI)")

# File uploader
uploaded_files = st.file_uploader("Выберите файлы протоколов (можно несколько)", type=['docx', 'pdf', 'txt'], accept_multiple_files=True)

if "logs" not in st.session_state:
    st.session_state.logs = []
if "process_running" not in st.session_state:
    st.session_state.process_running = False
if "analysis_complete" not in st.session_state:
    st.session_state.analysis_complete = False
if "output_files" not in st.session_state:
    st.session_state.output_files = [] # List of dicts {excel: path, word: path, name: str}

# Main area
col1, col2 = st.columns([2, 1])

with col1:
    log_placeholder = st.empty()
    
    # Validation and Indication editing
    tasks_to_run = []
    if uploaded_files:
        st.subheader("📋 План обработки")
        for i, file in enumerate(uploaded_files):
            # Auto-extract indication from filename
            # Remove extension
            filename = Path(file.name).stem
            # Remove "КП" or "Протокол" prefix if valid separator follows
            clean_name = filename
            for prefix in ["КП", "Протокол", "KP", "Protocol"]:
                if clean_name.upper().startswith(prefix):
                    clean_name = clean_name[len(prefix):].strip(" -_.")
            
            # Replace underscores with spaces
            clean_name = clean_name.replace("_", " ").strip()
            
            c1, c2 = st.columns([1, 2])
            c1.caption(f"Файл: {file.name}")
            indication_val = c2.text_input(f"Показание (Нозология) для {i+1}", value=clean_name, key=f"ind_{i}", label_visibility="collapsed", placeholder="Введите нозологию")
            tasks_to_run.append({"file": file, "indication": indication_val})

    # Function to read output from subprocess
    def read_output(pipe, q):
        try:
            for line in iter(pipe.readline, ''):
                q.put(line)
            pipe.close()
        except Exception:
            pass

    # Start analysis button
    if uploaded_files:
        if st.button("🚀 Запустить пакетный анализ", disabled=st.session_state.process_running):
            st.session_state.logs = []
            st.session_state.process_running = True
            st.session_state.analysis_complete = False
            st.session_state.output_files = []
            
            st.session_state.output_files = []
            
            # Use data/temp_uploads to keep root clean
            temp_dir = Path("data/temp_uploads")
            temp_dir.mkdir(parents=True, exist_ok=True)
            output_dir = Path("data/outputs")
            output_dir.mkdir(parents=True, exist_ok=True)

            total_files = len(tasks_to_run)
            
            progress_bar_total = st.progress(0)
            status_text_total = st.empty()
            
            for f_idx, task in enumerate(tasks_to_run):
                file_obj = task['file']
                ind = task['indication']
                
                if not ind:
                    st.session_state.logs.append(f"⚠️ Пропуск файла {file_obj.name}: не указана нозология.")
                    continue

                status_text_total.text(f"Обработка файла {f_idx + 1} из {total_files}: {file_obj.name}...")
                st.session_state.logs.append(f"🏁 ЗАПУСК АНАЛИЗА: {file_obj.name} ({ind})")
                
                # Save temp file
                temp_file_path = temp_dir / file_obj.name
                with open(temp_file_path, "wb") as f:
                    f.write(file_obj.getbuffer())
                
                # Output filename
                safe_indication = re.sub(r'[<>:"/\\|?*]', '_', ind).strip()
                output_filename = f"report_{safe_indication}.xlsx"
                output_path = output_dir / output_filename
                
                cmd = [
                    "python", "main.py",
                    "-i", str(temp_file_path),
                    "-o", str(output_path),
                    "--indication", ind,
                    "--max-workers", str(max_workers)
                ]
                
                env = os.environ.copy()
                env["ENABLE_CRITIQUE"] = "1" if enable_critique else "0"
                
                try:
                    process = subprocess.Popen(
                        cmd,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.STDOUT,
                        text=True,
                        encoding='utf-8', 
                        bufsize=1,
                        creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0,
                        env=env
                    )
                    
                    q = queue.Queue()
                    t = threading.Thread(target=read_output, args=(process.stdout, q))
                    t.daemon = True
                    t.start()
                    
                    # Log monitoring loop for current process
                    current_log_placeholder = st.empty()
                    
                    while True:
                        try:
                            line = q.get_nowait()
                        except queue.Empty:
                            if process.poll() is not None:
                                break
                            time.sleep(0.1)
                            continue
                        
                        clean_line = line.strip()
                        clean_line = line.strip()
                        if clean_line:
                            st.session_state.logs.append(clean_line)
                            # Update logs display (scrolling text area)
                            log_text = '\n'.join(st.session_state.logs)
                            log_placeholder.text_area("📋 Лог выполнения:", value=log_text, height=450, key=f"log_view_{len(st.session_state.logs)}")

                    process.wait()
                    
                    if process.returncode == 0:
                        st.session_state.logs.append(f"✅ Успешно: {file_obj.name}")
                        # Store result
                        res = {'name': ind, 'excel': str(output_path)}
                        word_path = output_path.with_suffix('.docx')
                        if word_path.exists():
                            res['word'] = str(word_path)
                        st.session_state.output_files.append(res)
                    else:
                        st.session_state.logs.append(f"❌ Ошибка при обработке {file_obj.name}")
                        
                except Exception as e:
                    st.session_state.logs.append(f"❌ Критическая ошибка запуска: {e}")
                
                # Cleanup
                try:
                    os.remove(temp_file_path)
                except:
                    pass
                
                progress_bar_total.progress((f_idx + 1) / total_files)

            st.session_state.process_running = False
            st.session_state.analysis_complete = True
            st.success("🎉 Пакетная обработка завершена!")
            
    elif len(st.session_state.logs) == 0:
        st.info("👆 Загрузите один или несколько файлов для начала.")

with col2:
    if st.session_state.analysis_complete and st.session_state.output_files:
        st.subheader("📥 Готовые отчеты")
        
        for item in st.session_state.output_files:
            with st.expander(f"📄 {item['name']}", expanded=True):
                excel_path = item.get('excel')
                if excel_path and os.path.exists(excel_path):
                    with open(excel_path, "rb") as f:
                        st.download_button(
                            label="📊 Excel",
                            data=f,
                            file_name=os.path.basename(excel_path),
                            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            key=f"dl_xl_{item['name']}"
                        )
                
                word_path = item.get('word')
                if word_path and os.path.exists(word_path):
                    with open(word_path, "rb") as f:
                        st.download_button(
                            label="📝 Word",
                            data=f,
                            file_name=os.path.basename(word_path),
                            mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            key=f"dl_wd_{item['name']}"
                        )

# Display full logs in expander
with st.expander("📜 Полный журнал выполнения", expanded=False):
    st.text('\n'.join(st.session_state.logs))
