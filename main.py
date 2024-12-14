from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session


from fastapi.middleware.cors import CORSMiddleware




# =====================================
# Configuration de la base de données
# =====================================
DATABASE_URL = "mysql+mysqlconnector://root:root@localhost:3306/testdb"  # Adapter selon vos identifiants

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# =====================================
# Modèle SQLAlchemy
# =====================================
class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    time = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)


Base.metadata.create_all(bind=engine)


# =====================================
# Schémas Pydantic (Pydantic v2)
# =====================================
class EventCreate(BaseModel):
    title: str
    time: str
    description: Optional[str] = None

class EventOut(BaseModel):
    id: int
    title: str
    time: str
    description: Optional[str]

    class Config:
        # from_attributes remplace orm_mode en Pydantic v2
        from_attributes = True


# =====================================
# Dépendance pour la session
# =====================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================
# Application FastAPI
# =====================================
app = FastAPI()


# =====================================
# Endpoints
# =====================================

@app.post("/events", response_model=EventOut)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = Event(title=event.title, time=event.time, description=event.description)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event



@app.get("/events", response_model=List[EventOut])
def get_all_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return events


@app.get("/events/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    return event


@app.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    db.delete(event)
    db.commit()
    return {"message": "Événement supprimé avec succès"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou bien ["http://127.0.0.1:5500"] pour être plus restrictif
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

