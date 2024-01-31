# Generated by Django 5.0.1 on 2024-01-31 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('writing', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='blind',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='mode',
            field=models.PositiveSmallIntegerField(choices=[(0, 'Normalne'), (1, 'Po zpátku'), (2, 'Hledej začáteční písmenka'), (3, 'Hledej písmenka ve slovech'), (4, 'Hledej pribuzna slova'), (5, 'Bez mezer'), (6, 'Opis koreny slov')], default=0),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='repeat',
            field=models.PositiveSmallIntegerField(default=1),
        ),
    ]
