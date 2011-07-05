from django import forms
from django.forms import ModelForm
from accounts.models import UserProfile, Partners, User
from captcha.fields import CaptchaField

class UserForm(forms.Form):
        username = forms.CharField(max_length=100, label = 'Username')
        email = forms.EmailField(label = 'E-Mail')
        password1 = forms.CharField(max_length=20, widget = forms.PasswordInput, label = 'Password')
        password2 = forms.CharField(max_length=20, widget = forms.PasswordInput, label = 'Confirm Password')
        occasiondate = forms.DateField(label= 'Occasion date', required=True, widget=forms.TextInput(attrs={'id' : 'datepicker'}), input_formats=('%d/%m/%Y',))
	captcha = CaptchaField()
		
        def clean_password1(self):
                password1 = self.cleaned_data['password1']
                if len(password1) < 2:
                        raise forms.ValidationError('Minimus 2 chars')
                return password1

        def clean_password2(self):
                password2 = self.cleaned_data['password2']
                try:
                        password1 = self.cleaned_data['password1']
                except KeyError:
                        return password2
                if password1 != password2:
                        raise forms.ValidationError('Please check the password')
                return password2

        def clean_email(self):
                try:
                        User.objects.get(email=self.cleaned_data['email'])
                        raise forms.ValidationError('Bad email address')
                except User.DoesNotExist:
                        return self.cleaned_data['email']

        def clean_username(self):
                try:
                        User.objects.get(username=self.cleaned_data['username'])
                        raise forms.ValidationError('Bad username')
                except User.DoesNotExist:
                        return self.cleaned_data['username']

class UserProfileForm(ModelForm):
        class Meta:
                model = UserProfile
                exclude = ('user','occasion_date', 'excel_hash')
				
class PartnersForm(ModelForm):
         class Meta:
                 model = Partners
                 exclude = ('userPartner')
				 
class UploadFileForm(forms.Form):
    title = forms.CharField(max_length=50)
    file  = forms.FileField()

