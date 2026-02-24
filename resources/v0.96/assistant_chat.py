#!/usr/bin/env python
# -*- coding: utf-8 -*-

import argparse
import json
import os
import sys
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

# Import our universal parser
from modules.protocol_parser import parse_protocol_file

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--message", type=str, required=True)
    parser.add_argument("--context", type=str, default="")
    parser.add_argument("--history", type=str, default="[]")
    parser.add_argument("--files", type=str, default="")
    args = parser.parse_args()

    # Load environment variables from the same .env file
    env_path = Path(__file__).parent / ".env"
    load_dotenv(dotenv_path=env_path)

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print(json.dumps({"error": "GEMINI_API_KEY not found", "reply": "Ошибка: API ключ Gemini не найден."}))
        return

    # Extract text from files
    file_contents = []
    if args.files:
        paths = args.files.split(',')
        for p in paths:
            path_obj = Path(p)
            if path_obj.exists():
                try:
                    text = parse_protocol_file(path_obj)
                    file_contents.append(f"СОДЕРЖИМОЕ ФАЙЛА {path_obj.name}:\n{text[:10000]}...") # Limit text per file to 10k chars for stability
                except Exception as e:
                    file_contents.append(f"ОШИБКА ПРИ ЧТЕНИИ ФАЙЛА {path_obj.name}: {str(e)}")

    genai.configure(api_key=api_key)
    
    # Advanced model selection
    try:
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        
        # Priority list
        priority = [
            'models/gemini-3-flash-preview',
            'models/gemini-2.5-flash',
            'models/gemini-flash-latest',
            'models/gemini-1.5-flash',
            'models/gemini-2.0-flash',
            'models/gemini-pro',
            'models/gemini-1.5-pro'
        ]
        
        selected_model = None
        for p in priority:
            if p in available_models:
                selected_model = p
                break
        
        if not selected_model and available_models:
            # Fallback to any available if priorities not found
            selected_model = available_models[0]
            
        if not selected_model:
            print(json.dumps({"error": "No models available", "reply": "Ошибка: для вашего API ключа не найдено доступных моделей Gemini."}))
            return

        model = genai.GenerativeModel(selected_model)
        
    except Exception as e:
        print(json.dumps({"error": str(e), "reply": f"Ошибка инициализации Gemini: {str(e)}"}))
        return

    history = json.loads(args.history)
    
    # Built instructions
    all_files_text = "\n\n".join(file_contents)
    
    system_prompt = f"""
    Ты - профессиональный AI-аналитик и ассистент Национального научного центра развития здравоохранения им. Салидат Кайрбековой.
    Твоя задача - отвечать на вопросы пользователя, выступая в роли интеллектуальной базы знаний (аналог NotebookLM).
    
    ОСНОВНОЙ КОНТЕКСТ (информация о технологии):
    {args.context}
    
    ДАННЫЕ ИЗ ЗАГРУЖЕННЫХ ДОКУМЕНТОВ:
    {all_files_text if all_files_text else "Документы не загружены."}
    
    ИНСТРУКЦИИ:
    1. Ответ должен строиться в первую очередь на данных из загруженных документов и контекста технологии.
    2. Если в документах есть ответ, укажи, из какого файла или раздела взята информация (цитируй).
    3. Если информации в контексте нет, ты можешь использовать свои общие знания, но ОБЯЗАТЕЛЬНО начни ответ с фразы: "В предоставленных документах нет прямой информации об этом, однако на основе общих данных..."
    4. Отвечай вежливо, структурированно (используй списки и жирный шрифт для акцентов).
    5. Язык ответа должен соответствовать языку вопроса.
    """

    # Prepare chat session
    chat_session_history = []
    for msg in history:
        role = "user" if msg['type'] == 'user' else "model"
        chat_session_history.append({"role": role, "parts": [msg['text']]})

    chat = model.start_chat(history=chat_session_history)

    try:
        # Wrap system prompt into the user message for a single-turn-like structure with history
        response = chat.send_message(f"{system_prompt}\n\nВОПРОС ПОЛЬЗОВАТЕЛЯ: {args.message}")
        print(json.dumps({"reply": response.text}))
    except Exception as e:
        # Fallback if chat session fails due to history format or size
        try:
            response = model.generate_content(f"{system_prompt}\n\nВОПРОС ПОЛЬЗОВАТЕЛЯ: {args.message}")
            print(json.dumps({"reply": response.text}))
        except Exception as e2:
            print(json.dumps({"error": str(e2), "reply": f"Произошла ошибка при вызове Gemini API: {str(e2)}"}))

if __name__ == "__main__":
    main()
