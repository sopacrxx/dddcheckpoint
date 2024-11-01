from database import db

class Projeto(db.Model):
    __tablename__ = 'projetos'  # Corrigido
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    data_inicio = db.Column(db.Date, nullable=False)
    data_fim = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum('planejado', 'em andamento', 'concluído'), nullable=False)
