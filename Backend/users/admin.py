
from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'full_name', 'phone_number', 'is_active', 'is_staff')
   # list_filter = ('is_approved', 'is_staff', 'is_superuser')
    search_fields = ('email', 'full_name')
