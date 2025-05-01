from api import db


class Avatar(db.Model):
    __tablename__ = 'avatars'

    id = db.Column(db.Integer, primary_key=True)
    avatar = db.Column(db.LargeBinary, default=False, nullable=False)
    standard = db.Column(db.Boolean, default=False, nullable=False)


    def update(self, data):
        for key in data:
            setattr(self, key, data[key])

    def serialize(self):
        return {
            "id": self.id,
            "avatar": self.avatar,
            "standard": self.standard
        }
