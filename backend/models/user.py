from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    google_user_id = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    chroma_collection_name = db.Column(db.String, unique=True, nullable=False)

    def __init__(self, google_user_id, email, chroma_collection_name):
        self.google_user_id = google_user_id
        self.email = email
        self.chroma_collection_name = chroma_collection_name

    @classmethod
    def get_or_create(cls, google_user_id, email, chroma_client):
        user = cls.query.filter_by(google_user_id=google_user_id).first()

        if not user:
            # Generate a unique collection name for Chroma
            collection_name = f"recipes_user_{google_user_id}"

            # Create the collection in Chroma if it doesn't exist
            chroma_client.get_or_create_collection(collection_name)

            user = cls(
                google_user_id=google_user_id,
                email=email,
                chroma_collection_name=collection_name
            )
            db.session.add(user)
            db.session.commit()

        return user
