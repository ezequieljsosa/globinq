# Generated by Django 2.2.4 on 2019-08-05 04:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('globinq', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='globin',
            name='e7_portal',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='e7_portal', to='globinq.Channel'),
        ),
        migrations.AlterField(
            model_name='globin',
            name='g8_channel',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='g8_channel', to='globinq.Channel'),
        ),
        migrations.AlterField(
            model_name='globin',
            name='l_channel',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='l_channel', to='globinq.Channel'),
        ),
    ]