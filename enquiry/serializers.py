from rest_framework import serializers
from .models import StudentEnquiry
import re

class StudentEnquirySerializer(serializers.ModelSerializer):
    def validate_phone_number(self, value):
        if not re.fullmatch(r"^[9876]\d{9}$", value):
            raise serializers.ValidationError("Phone number must start with 9, 8, 7, or 6 and be exactly 10 digits.")
        return value

    def validate_email(self, value):
        if not value.endswith("@gmail.com"):
            raise serializers.ValidationError("Only @gmail.com emails are allowed.")
        return value

    def validate_name(self, value):
        if not re.fullmatch(r"^[A-Za-z ]+$", value):
            raise serializers.ValidationError("Name must only contain alphabets and spaces.")
        return value

    def validate_consent_to_contact(self, value):
        if not value:
            raise serializers.ValidationError("You must provide consent to proceed.")
        return value
    
    class Meta:
        model = StudentEnquiry
        fields = '__all__'

class StudentEnquiryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentEnquiry
        fields = [
            'name',
            'phone_number',
            'email',
            'current_location',
            'course_enquiry',
            'training_mode',
            'training_timing',
            'start_time',
            'calling1',
            'calling2',
            'calling3',
            'calling4',
            'calling5',
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Replace None with empty string for calling fields
        for field in ['calling1', 'calling2', 'calling3', 'calling4', 'calling5']:
            if data.get(field) is None:
                data[field] = ""
        return data
