from flask import Flask, request, jsonify
from database import db
from models import Projeto

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/projeto_db'
db.init_app(app)

@app.route('/api/projetos', methods=['GET'])
def get_projetos():
    projetos = Projeto.query.all()
    return jsonify([{
        'id': p.id,
        'nome': p.nome,
        'descricao': p.descricao,
        'data_inicio': p.data_inicio.isoformat(),  # Formato de data
        'data_fim': p.data_fim.isoformat(),        # Formato de data
        'status': p.status
    } for p in projetos])

@app.route('/api/projetos', methods=['POST'])
def create_projeto():
    data = request.get_json()
    if not all(key in data for key in ('nome', 'descricao', 'data_inicio', 'data_fim', 'status')):
        return jsonify({'message': 'Dados incompletos'}), 400

    novo_projeto = Projeto(
        nome=data['nome'],
        descricao=data['descricao'],
        data_inicio=data['data_inicio'],
        data_fim=data['data_fim'],
        status=data['status']
    )
    db.session.add(novo_projeto)
    db.session.commit()
    return jsonify({'message': 'Projeto criado com sucesso'}), 201

@app.route('/api/projetos/<int:id>', methods=['PUT'])
def update_projeto(id):
    data = request.get_json()
    projeto = Projeto.query.get(id)
    if projeto:
        if not all(key in data for key in ('nome', 'descricao', 'data_inicio', 'data_fim', 'status')):
            return jsonify({'message': 'Dados incompletos'}), 400

        projeto.nome = data['nome']
        projeto.descricao = data['descricao']
        projeto.data_inicio = data['data_inicio']
        projeto.data_fim = data['data_fim']
        projeto.status = data['status']
        db.session.commit()
        return jsonify({'message': 'Projeto atualizado com sucesso'})
    return jsonify({'message': 'Projeto não encontrado'}), 404

@app.route('/api/projetos/<int:id>', methods=['DELETE'])
def delete_projeto(id):
    projeto = Projeto.query.get(id)
    if projeto:
        db.session.delete(projeto)
        db.session.commit()
        return jsonify({'message': 'Projeto excluído com sucesso'})
    return jsonify({'message': 'Projeto não encontrado'}), 404

if __name__ == '__main__':
    app.run(debug=True)
