from django.db import models
import re
from django.core.exceptions import ValidationError

# -------------------- Validators --------------------
def validate_phone_number(value):
    if not re.fullmatch(r"^[9876]\d{9}$", value):
        raise ValidationError("Phone number must start with 9, 8, 7, or 6 and be exactly 10 digits.")

def validate_gmail_email(value):
    if not value.endswith("@gmail.com"):
        raise ValidationError("Only @gmail.com emails are allowed.")

def validate_name(value):
    if not re.fullmatch(r"^[A-Za-z ]{2,100}$", value):
        raise ValidationError("Name must be 2-100 characters long and contain only alphabets and spaces.")

# -------------------- Model --------------------
class StudentEnquiry(models.Model):
    name = models.CharField(max_length=100, validators=[validate_name])
    phone_number = models.CharField(max_length=10, validators=[validate_phone_number])
    email = models.EmailField(validators=[validate_gmail_email])
    current_location = models.CharField(max_length=255)

    COURSE_CHOICES = [
        ("Professional Starter Testing", "Professional Starter Testing"),
        ("Professional Experts with Java Automation", "Professional Experts with Java Automation"),
        ("Professional Experts with Python Automation", "Professional Experts with Python Automation"),
        ("Professional Experts with Mobile Automation", "Professional Experts with Mobile Automation"),
        ("Professional Experts with API Automation", "Professional Experts with API Automation"),
        ("SDET Xpert", "SDET Xpert"),
        ("Individual Courses", "Individual Courses"),
        ("AI Testing", "AI Testing"),
        ("Playwright", "Playwright"),
        ("Cypress", "Cypress"),
        ("Python Development Full Stack", "Python Development Full Stack"),
        ("Java Full Stack Development", "Java Full Stack Development"),
        ("MERN Stack", "MERN Stack"),
        ("UI/UX Designing", "UI/UX Designing"),
        ("AI/ML Engineering", "AI/ML Engineering"),
        ("Data Analytics", "Data Analytics"),
        ("Diploma in Software Engineering at Testing", "Diploma in Software Engineering at Testing"),
        ("Diploma in Software Engineering at Development", "Diploma in Software Engineering at Development"),
        ("Other", "Other"),
    ]
    course_enquiry = models.CharField(max_length=255, choices=COURSE_CHOICES)

    TRAINING_MODE_CHOICES = [
        ("Offline", "Offline"),
        ("Online", "Online"),
        ("Hybrid", "Hybrid"),
    ]
    training_mode = models.CharField(max_length=20, choices=TRAINING_MODE_CHOICES)

    TRAINING_TIMING_CHOICES = [
        ("Morning (7AM Batch)", "Morning (7AM Batch)"),
        ("Evening (8PM Batch)", "Evening (8PM Batch)"),
        ("Anytime in Weekdays", "Anytime in Weekdays"),
        ("Weekends", "Weekends"),
    ]
    training_timing = models.CharField(max_length=50, choices=TRAINING_TIMING_CHOICES)

    START_TIME_CHOICES = [
        ("Immediate", "Immediate"),
        ("After 10 days", "After 10 days"),
        ("After 15 days", "After 15 days"),
        ("After 1 Month", "After 1 Month"),
    ]
    start_time = models.CharField(max_length=50, choices=START_TIME_CHOICES, default="Immediate")

    PROFESSIONAL_SITUATION_CHOICES = [
        ("Fresher", "Fresher"),
        ("Currently Working", "Currently Working"),
        ("Willing to Switch from Another Domain", "Willing to Switch from Another Domain"),
        ("Other", "Other"),
    ]
    professional_situation = models.CharField(max_length=100, choices=PROFESSIONAL_SITUATION_CHOICES)

    QUALIFICATION_CHOICES = [
        ("Diploma", "Diploma"),
        ("Bachelor's Degree", "Bachelor's Degree"),
        ("Master's Degree", "Master's Degree"),
        ("Other", "Other"),
    ]
    qualification = models.CharField(max_length=50, choices=QUALIFICATION_CHOICES)

    EXPERIENCE_CHOICES = [
        ("Less than 1 Year or Fresher", "Less than 1 Year or Fresher"),
        ("1-3 Years", "1-3 Years"),
        ("3-5 Years", "3-5 Years"),
        ("5+ Years", "5+ Years"),
    ]
    experience = models.CharField(max_length=50, choices=EXPERIENCE_CHOICES)

    REFERRAL_CHOICES = [
        ("Instagram", "Instagram"),
        ("WhatsApp Channel", "WhatsApp Channel"),
        ("Facebook", "Facebook"),
        ("LinkedIn", "LinkedIn"),
        ("YouTube", "YouTube"),
        ("Friend Reference", "Friend Reference"),
        ("College Reference", "College Reference"),
        ("Other Social Network", "Other Social Network"),
    ]
    referral_source = models.CharField(max_length=100, choices=REFERRAL_CHOICES)

    consent_to_contact = models.BooleanField(default=False)

    calling1 = models.CharField(max_length=255, blank=True, null=True)
    calling2 = models.CharField(max_length=255, blank=True, null=True)
    calling3 = models.CharField(max_length=255, blank=True, null=True)
    calling4 = models.CharField(max_length=255, blank=True, null=True)
    calling5 = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.course_enquiry}"

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Student Enquiries"
