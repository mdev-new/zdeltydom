# Generated by Django 5.0.1 on 2024-01-31 21:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('_global', '0002_user_credit_user_role'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='role',
        ),
    ]
