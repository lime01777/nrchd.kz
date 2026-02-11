"""
Примеры валидации входных данных
"""
from pathlib import Path
from typing import Optional
from examples.exceptions_example import ValidationError, ParsingError


def validate_protocol_file(file_path: Path, max_size_mb: int = 100) -> None:
    """
    Валидация файла протокола перед обработкой
    
    Args:
        file_path: Путь к файлу протокола
        max_size_mb: Максимальный размер файла в МБ
        
    Raises:
        ValidationError: Если файл не прошел валидацию
        FileNotFoundError: Если файл не существует
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Файл не найден: {file_path}")
    
    if not file_path.is_file():
        raise ValidationError(f"Путь не является файлом: {file_path}", field="file_path")
    
    # Проверка размера
    file_size = file_path.stat().st_size
    max_size_bytes = max_size_mb * 1024 * 1024
    
    if file_size == 0:
        raise ValidationError("Файл пуст", field="file_size", value=file_size)
    
    if file_size > max_size_bytes:
        raise ValidationError(
            f"Файл слишком большой: {file_size / 1024 / 1024:.1f} МБ (максимум: {max_size_mb} МБ)",
            field="file_size",
            value=file_size
        )
    
    # Проверка расширения
    valid_extensions = {'.docx', '.pdf', '.txt', '.doc'}
    if file_path.suffix.lower() not in valid_extensions:
        raise ValidationError(
            f"Неподдерживаемый формат файла: {file_path.suffix}. Поддерживаются: {', '.join(valid_extensions)}",
            field="file_extension",
            value=file_path.suffix
        )


def validate_indication(indication: str) -> None:
    """
    Валидация клинической индикации
    
    Args:
        indication: Клиническая индикация
        
    Raises:
        ValidationError: Если индикация не валидна
    """
    if not indication:
        raise ValidationError("Индикация не может быть пустой", field="indication")
    
    if len(indication.strip()) < 3:
        raise ValidationError(
            "Индикация слишком короткая (минимум 3 символа)",
            field="indication",
            value=indication
        )
    
    if len(indication) > 500:
        raise ValidationError(
            "Индикация слишком длинная (максимум 500 символов)",
            field="indication",
            value=len(indication)
        )


def validate_drug_entity(entity: dict) -> None:
    """
    Валидация извлеченной сущности препарата
    
    Args:
        entity: Словарь с данными о препарате
        
    Raises:
        ValidationError: Если сущность не валидна
    """
    required_fields = ['drug_name']
    
    for field in required_fields:
        if field not in entity or not entity[field]:
            raise ValidationError(
                f"Отсутствует обязательное поле: {field}",
                field=field
            )
    
    # Проверка типов
    if not isinstance(entity.get('drug_name'), str):
        raise ValidationError(
            "drug_name должен быть строкой",
            field="drug_name",
            value=type(entity.get('drug_name'))
        )
    
    # Проверка длины названия
    drug_name = entity.get('drug_name', '')
    if len(drug_name) > 200:
        raise ValidationError(
            "Название препарата слишком длинное (максимум 200 символов)",
            field="drug_name",
            value=len(drug_name)
        )


def validate_output_path(output_path: Path, overwrite: bool = False) -> None:
    """
    Валидация пути для выходного файла
    
    Args:
        output_path: Путь к выходному файлу
        overwrite: Разрешить перезапись существующего файла
        
    Raises:
        ValidationError: Если путь не валиден
    """
    # Проверка расширения
    if output_path.suffix.lower() not in {'.xlsx', '.docx'}:
        raise ValidationError(
            f"Неподдерживаемый формат выходного файла: {output_path.suffix}",
            field="output_extension",
            value=output_path.suffix
        )
    
    # Проверка существующего файла
    if output_path.exists() and not overwrite:
        raise ValidationError(
            f"Файл уже существует: {output_path}. Используйте --overwrite для перезаписи",
            field="output_path"
        )
    
    # Проверка директории
    output_dir = output_path.parent
    if not output_dir.exists():
        try:
            output_dir.mkdir(parents=True, exist_ok=True)
        except Exception as e:
            raise ValidationError(
                f"Не удалось создать директорию для выходного файла: {e}",
                field="output_dir"
            )


# Пример использования
if __name__ == "__main__":
    # Валидация файла
    try:
        validate_protocol_file(Path("data/inputs/protocol.docx"))
        print("✓ Файл валиден")
    except (ValidationError, FileNotFoundError) as e:
        print(f"✗ Ошибка валидации: {e}")
    
    # Валидация индикации
    try:
        validate_indication("Diabetes Mellitus Type 2")
        print("✓ Индикация валидна")
    except ValidationError as e:
        print(f"✗ Ошибка валидации: {e}")
    
    # Валидация сущности
    try:
        validate_drug_entity({
            'drug_name': 'метформин',
            'dosage': '500 мг',
            'route': 'oral'
        })
        print("✓ Сущность валидна")
    except ValidationError as e:
        print(f"✗ Ошибка валидации: {e}")

