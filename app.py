from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
import uvicorn

# Configuration de l'application
app = FastAPI()

# Activer CORS pour éviter les erreurs liées au cross-origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurer l'accès statique aux fichiers
app.mount("/static", StaticFiles(directory="static"), name="static")

# Connexion à la base de données MySQL
DATABASE_URL = "mysql+mysqlconnector://root:root@localhost/calendar_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Modèle pour les événements
class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    start = Column(DateTime)
    end = Column(DateTime)

from pydantic import BaseModel

class EventDelete(BaseModel):
    id: int

# Créer les tables si elles n'existent pas encore
Base.metadata.create_all(bind=engine)

# Modèle Pydantic pour valider les données
class EventCreate(BaseModel):
    title: str
    start: datetime
    end: datetime


# Routes API
@app.get("/events")
def get_events():
    db = SessionLocal()
    events = db.query(Event).all()
    db.close()
    return [{"id": event.id, "title": event.title, "start": event.start, "end": event.end} for event in events]


@app.post("/add_event")
def add_event(event: EventCreate):
    db = SessionLocal()
    new_event = Event(title=event.title, start=event.start, end=event.end)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    db.close()
    return {"message": "Événement ajouté !"}


@app.post("/delete_event")
def delete_event(event: EventDelete):
    db = SessionLocal()
    # Recherche l'événement par ID
    event_to_delete = db.query(Event).filter(Event.id == event.id).first()
    if not event_to_delete:
        db.close()
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    db.delete(event_to_delete)
    db.commit()
    db.close()
    return {"message": "Événement supprimé !"}



# Point d'entrée
if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
