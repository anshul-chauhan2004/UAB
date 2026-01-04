#!/usr/bin/env python3
import re
import sys

def remove_emojis(file_path):
    """Remove all emojis from a file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace common emojis with nothing or appropriate text
    emoji_replacements = {
        '📝 Assignments': 'Assignments',
        '📊 Assessments': 'Assessments',
        '✓ Attendance': 'Attendance',
        '🔔 Notifications': 'Notifications',
        '🔔 Alerts': 'Alerts',
        '📝 My Assignments': 'My Assignments',
        '📊 My Assessments': 'My Assessments',
        '✓ My Attendance & Performance': 'My Attendance & Performance',
        '🔔 Notifications': 'Notifications',
        '📝 Manage Assignments': 'Manage Assignments',
        '📊 Manage Assessments': 'Manage Assessments',
        '✓ Manage Attendance': 'Manage Attendance',
        '📊 Manage your existing courses': 'Manage your existing courses',
        '👥 View student enrollment statistics': 'View student enrollment statistics',
        '📅 ': '',
        '👥 ': '',
        '📊 ': '',
        '📝 ': '',
        '✓ ': '',
        '🚀 ': '',
        '⚠️ ': 'Warning: ',
        '⏱️ ': '',
        '⏳ ': '',
    }
    
    for emoji, replacement in emoji_replacements.items():
        content = content.replace(emoji, replacement)
    
    # Additional regex to remove any remaining emoji characters
    emoji_pattern = re.compile("["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
        u"\U00002702-\U000027B0"
        u"\U000024C2-\U0001F251"
        u"\u2713"  # checkmark
        "]+", flags=re.UNICODE)
    
    content = emoji_pattern.sub('', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Removed emojis from {file_path}")

if __name__ == "__main__":
    files = [
        'client/src/pages/TeacherDashboard.js',
        'client/src/pages/StudentDashboard.js'
    ]
    
    for file_path in files:
        try:
            remove_emojis(file_path)
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
