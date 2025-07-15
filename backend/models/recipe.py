class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String)
    url = db.Column(db.String)
    ingredients = db.Column(db.JSON)
    embedding_id = db.Column(db.String)  # link to vector DB
