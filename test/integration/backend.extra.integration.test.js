const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

const server = 'http://localhost:5000';

// Variables para almacenar tokens y recursos creados
let token = '';
let userId = '';
let petId = '';
let reservationId = '';
let providerId = '';

// Tests de integración alineados con las rutas y lógica real

describe('Backend Extra Integration Tests', () => {
  // Test de registro de usuario
  it('debe registrar un usuario', (done) => {
    chai.request(server)
      .post('/api/auth/register')
      .send({ fullName: 'Test User', email: 'testuser@mail.com', password: '123456' })
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(201);
        userId = res.body.usuario?._id || '';
        done();
      });
  });

  // Test de login de usuario
  it('debe loguear al usuario y devolver un token', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({ email: 'testuser@mail.com', password: '123456' })
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(200);
        expect(res.body.token).to.exist;
        token = res.body.token;
        done();
      });
  });

  // Test de obtención de perfil de usuario autenticado
  it('debe obtener el perfil del usuario autenticado', (done) => {
    chai.request(server)
      .get('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(200);
        expect(res.body.email).to.equal('testuser@mail.com');
        done();
      });
  });

  // Test de creación de mascota
  it('debe crear una mascota para el usuario', (done) => {
    chai.request(server)
      .post('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Firulais')
      .field('type', 'dog')
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(201);
        petId = res.body._id || '';
        done();
      });
  });

  // Test de obtención de mascotas del usuario
  it('debe obtener las mascotas del usuario', (done) => {
    chai.request(server)
      .get('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Test de creación de reserva (requiere providerId real)
  it('debe obtener prestadores y reservar con uno', (done) => {
    chai.request(server)
      .get('/api/prestadores')
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        providerId = res.body.data[0]?._id;
        chai.request(server)
          .post('/api/reservations')
          .set('Authorization', `Bearer ${token}`)
          .send({ userId, petId, providerId, date: '2025-07-01', time: '10:00' })
          .end((err2, res2) => {
            if (err2) {
              console.error('Error de conexión:', err2.message);
              return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
            }
            expect(res2).to.have.status(201);
            reservationId = res2.body._id || '';
            done();
          });
      });
  });

  // Test de obtención de reservas
  it('debe obtener las reservas del usuario', (done) => {
    chai.request(server)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Test de dejar un review en una reserva
  it('debe dejar un review en la reserva', (done) => {
    chai.request(server)
      .post(`/api/reservations/${reservationId}/review`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5, comment: 'Excelente servicio' })
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(201);
        done();
      });
  });

  // Test de enviar mensaje por chat (requiere reserva válida)
  it('debe enviar un mensaje por chat', (done) => {
    chai.request(server)
      .post('/api/chat/mensaje')
      .set('Authorization', `Bearer ${token}`)
      .send({ reservaId: reservationId, mensaje: 'Hola, ¿todo listo?' })
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(201);
        done();
      });
  });

  // Test de obtener mensajes del chat de una reserva
  it('debe obtener mensajes del chat de la reserva', (done) => {
    chai.request(server)
      .get(`/api/chat/mensajes/${reservationId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Test de eliminación de mascota
  it('debe eliminar la mascota creada', (done) => {
    chai.request(server)
      .delete(`/api/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(200);
        done();
      });
  });

  // Test de eliminación de usuario
  it('debe eliminar el usuario creado', (done) => {
    chai.request(server)
      .delete(`/api/auth/usuarios/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error('Error de conexión:', err.message);
          return done(new Error('El servidor backend no está respondiendo. Asegúrate de que esté corriendo en el puerto 5000.'));
        }
        expect(res).to.have.status(200);
        done();
      });
  });
});
