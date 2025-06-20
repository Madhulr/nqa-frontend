from rest_framework import viewsets
from .models import StudentEnquiry
from .serializers import StudentEnquirySerializer, StudentEnquiryListSerializer

class StudentEnquiryViewSet(viewsets.ModelViewSet):
    queryset = StudentEnquiry.objects.all().order_by('-id')

    def get_serializer_class(self):
        if self.action == 'list':        # GET API (Table)
            return StudentEnquiryListSerializer
        return StudentEnquirySerializer  # POST / PUT / GET(id) / DELETE