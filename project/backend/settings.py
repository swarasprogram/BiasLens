"""
Django settings for backend project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv  # use this instead of decouple for now

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env BEFORE using os.getenv
load_dotenv(BASE_DIR / ".env")

# -------------------------
# Security / environment
# -------------------------

# Read from environment (set this in Render dashboard)
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")

# DEBUG: False in production, True locally
DEBUG = os.getenv("DEBUG", "False") == "True"

# ALLOWED_HOSTS: comma-separated
# e.g. in Render: ALLOWED_HOSTS=your-backend.onrender.com
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

# -------------------------
# Application definition
# -------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'core',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # put CORS high up
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# 🟡 Update these once you know your actual URLs
CORS_ALLOWED_ORIGINS = [
    # local dev frontend
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # production frontend (replace with real Vercel URL)
    "https://your-vercel-app.vercel.app",
]

CSRF_TRUSTED_ORIGINS = [
    # production backend (Render) – replace with real URL
    "https://biaslens-backend.onrender.com",
    # optionally also your frontend
    "https://your-vercel-app.vercel.app",
]

# while testing, you *can* keep this:
CORS_ALLOW_ALL_ORIGINS = True  # remove later for stricter security

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# -------------------------
# Database
# -------------------------

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# -------------------------
# Password validation
# -------------------------

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# -------------------------
# Internationalization
# -------------------------

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -------------------------
# Static files
# -------------------------

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / "staticfiles"  # ✅ needed for collectstatic on Render

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -------------------------
# Other env-based settings
# -------------------------

NEWS_API_KEY = os.getenv('NEWS_API_KEY')