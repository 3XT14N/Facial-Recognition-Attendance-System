# config.py
import os

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://FRA:QwertyQwerty1@fra.kfqh5.mongodb.net/fra_database?retryWrites=true&w=majority&appName=FRA")
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")