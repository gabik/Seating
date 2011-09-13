from django import forms

table_kind_list = (
	#('round_pink', '<img id="round_pink" border=0 src="http://photos1.fotosearch.com/bthumb/UNC/UNC002/u13738840.jpg" class="MenuItem">'),
	#('long_square', '<img id="long_square" border=0 src="http://www1.free-clipart.net/gallery2/clipart/Household/Miscellaneous/Table_Setting_1.jpg" class="MenuItem">'),
	('round_pink', ''),
	('long_square', ''),
	)

table_size_list = (
	(8, '8'), 
	(9, '9'), 
	(10, '10'), 
	(12, '12'), 
	(15, '15'),
	)

class InitCanvas(forms.Form):
	table_kind = forms.ChoiceField(widget=forms.RadioSelect, choices=table_kind_list, required=False)
	table_size = forms.ChoiceField(widget=forms.RadioSelect, choices=table_size_list, required=False)
	tables_num = forms.IntegerField(min_value=1, max_value=48, required=False)
		
