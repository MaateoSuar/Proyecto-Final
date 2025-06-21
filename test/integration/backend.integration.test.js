const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

// Cambia la ruta si tu server no está en localhost:3000
const server = 'http://localhost:5000';

describe('Pruebas de Integración de Backend', () => {
  // Test que verifica login correcto
  it('debería devolver 200 en /api/auth/login', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({ email: 'test@mail.com', password: '1234' })
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 3000.'));
        }
        expect(res).to.have.status(200);
        done();
      });
  });

  // Test que verifica login con credenciales incorrectas
  it('debería devolver 401 con credenciales incorrectas', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({ email: 'bad@mail.com', password: 'wrong' })
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 3000.'));
        }
        expect(res).to.have.status(401);
        done();
      });
  });

  // Test que obtiene todas las mascotas
  it('debería obtener todas las mascotas', (done) => {
    chai.request(server)
      .get('/api/pets')
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 3000.'));
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Test que crea una nueva reserva
  it('debería crear una nueva reserva', (done) => {
    chai.request(server)
      .post('/api/reservations')
      .send({ userId: 1, petId: 2, date: '2025-07-01' })
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 3000.'));
        }
        expect(res).to.have.status(201);
        done();
      });
  });

  // Test para ruta desconocida
  it('debería devolver 404 para ruta desconocida', (done) => {
    chai.request(server)
      .get('/api/unknown')
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 3000.'));
        }
        expect(res).to.have.status(404);
        done();
      });
  });
});
