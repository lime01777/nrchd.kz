"""
Типизированные структуры данных
"""
from typing import TypedDict, Optional, List
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


# Использование TypedDict для словарей
class DrugEntity(TypedDict, total=False):
    """Извлеченная сущность препарата из протокола"""
    drug_name: str
    inn_english: Optional[str]
    inn_russian: Optional[str]
    dosage: Optional[str]
    route: Optional[str]
    frequency: Optional[str]
    duration: Optional[str]
    author_ud: Optional[str]


class PubMedArticle(TypedDict, total=False):
    """Статья из PubMed"""
    title: str
    authors: str
    journal: str
    year: Optional[int]
    pmid: str
    pmcid: Optional[str]  # PubMed Central ID (если доступен)
    doi: Optional[str]  # Digital Object Identifier
    url: str
    type: str  # RCT, Meta-Analysis, Systematic Review, etc.


class PubMedData(TypedDict, total=False):
    """Данные из PubMed для препарата"""
    articles: List[PubMedArticle]
    total_found: int
    rct_count: int
    meta_analysis_count: int
    systematic_review_count: int
    error: bool


class FDAData(TypedDict, total=False):
    """Данные из FDA"""
    approved: bool
    indication: Optional[str]
    approval_date: Optional[str]
    url: Optional[str]


class ClinicalTrial(TypedDict, total=False):
    """Клиническое исследование"""
    title: str
    status: str
    url: str
    start_date: Optional[str]
    completion_date: Optional[str]


class KZRegisterData(TypedDict, total=False):
    """Данные из казахстанского реестра"""
    found: bool
    registration_status: Optional[str]
    registration_number: Optional[str]
    dosage_forms: Optional[str]
    reregistration_status: Optional[str]


# Использование dataclass для более сложных структур
@dataclass
class VerificationRecord:
    """Полная запись верификации препарата"""
    original_name: str
    inn: str
    inn_russian: Optional[str] = None
    dosage: Optional[str] = None
    route: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    author_ud: Optional[str] = None
    indication: Optional[str] = None
    
    # Формуляры
    formulary_bnf: bool = False
    formulary_bnfc: bool = False
    formulary_who_eml: bool = False
    formulary_detailed: Optional[dict] = None
    
    # Регуляторы
    approval_fda: Optional[FDAData] = None
    approval_ema: Optional[str] = None
    
    # Исследования
    evidence_pubmed: Optional[PubMedData] = None
    clinical_trials: Optional[List[ClinicalTrial]] = None
    
    # Казахстан
    kz_register: Optional[KZRegisterData] = None
    
    # Результаты анализа
    system_ud: Optional[str] = None
    evidence_level_justification: Optional[str] = None
    summary_recommendation: Optional[str] = None
    completeness: Optional[str] = None
    compliance_notes: Optional[str] = None
    evidence_commentary: Optional[dict] = None
    
    # Метаданные
    comments: Optional[str] = None
    created_at: Optional[datetime] = None
    
    def to_dict(self) -> dict:
        """Конвертация в словарь для совместимости"""
        return {
            'original_name': self.original_name,
            'inn': self.inn,
            'inn_russian': self.inn_russian,
            'dosage': self.dosage,
            'route': self.route,
            'frequency': self.frequency,
            'duration': self.duration,
            'author_ud': self.author_ud,
            'indication': self.indication,
            'formulary_bnf': self.formulary_bnf,
            'formulary_bnfc': self.formulary_bnfc,
            'formulary_who_eml': self.formulary_who_eml,
            'formulary_detailed': self.formulary_detailed,
            'approval_fda': self.approval_fda,
            'approval_ema': self.approval_ema,
            'evidence_pubmed': self.evidence_pubmed,
            'clinical_trials': self.clinical_trials,
            'kz_register': self.kz_register,
            'system_ud': self.system_ud,
            'evidence_level_justification': self.evidence_level_justification,
            'summary_recommendation': self.summary_recommendation,
            'completeness': self.completeness,
            'compliance_notes': self.compliance_notes,
            'evidence_commentary': self.evidence_commentary,
            'comments': self.comments,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'VerificationRecord':
        """Создание из словаря"""
        return cls(**data)


@dataclass
class AnalysisResult:
    """Результат полного анализа протокола"""
    input_file: Path
    indication: str
    drugs: List[VerificationRecord]
    protocol_summary: Optional[str] = None
    created_at: Optional[datetime] = None
    duration_seconds: Optional[float] = None
    
    @property
    def total_drugs(self) -> int:
        """Общее количество препаратов"""
        return len(self.drugs)
    
    @property
    def drugs_by_grade(self) -> dict:
        """Распределение препаратов по уровням доказательности"""
        grades = {}
        for drug in self.drugs:
            grade = drug.system_ud or 'D'
            grades[grade] = grades.get(grade, 0) + 1
        return grades

