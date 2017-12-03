// Import Admin SDK
const admin = require('firebase-admin');

// Configurando o banco de Desenvolvimento
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "citadinodsv",
    clientEmail: "firebase-adminsdk-6xhom@citadinodsv.iam.gserviceaccount.com",
    private_key_id: "c6884e776b8547947f9f0777d3c9a264e652d74c",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBuUD45obtyfJe\nVsnbXAA3bloj6s6vHLeX90+6sMHlcta/tAoAzYvAur5d6KkPGgAY+IbAsUwzvHn8\n5OPZEdOx9BLqB2JQL8ioSeEpW5ht4+xvy+ncXWZlDF8Xm4O47iS3unPhDXiVTvUp\nzC4RXcD5CYBvCqdYCVLZpZUe9RODn0RepVitrs2CVCl50pMDwaGtmVMaEUcUdLiu\nUUe1VExqJAgs2WohpFrAjLaE/vD+lhH7RzqtCJdMeQjFoLbYuoGeh80iJlsGcSGA\no71Ewbi8kqeG9YzEWu6vMPx4jpYSEb6gldJFYKgA3i/KoGlLVTsQVXD8pVmhuSHs\newdqk2W9AgMBAAECggEAOQrVDFVI/sS7pra0enCFKc1HIpNV568zij5KzkSU23ys\nqkcXuPPNRmNWga1r9mPoCnJHr36lWwiQ/Pvi8Xxz0s71MM8azlS7p34VnEl5wUXf\nTW4EPxyLdY6mg3uJ1k7dJfJzg52lV4Wn3/ZczEVIeKwpEslWzC/2otrEZZixdcxQ\ndhNW0MhfQvlxzsHzWQemsCkrI7vYGUILKr4/myKaGh6ujrkSfsW1ai2642gsttn1\nMu4oayZFLFLCKSMgB1Shy+YZkQwyXzFe4adMyNq6Y7b2i9GkezJ/z21iQ8Pr1GRa\n3Pm+KbqZy/MlmmceFKHxddL4scEwB69gjK/QQeZWSwKBgQD4XHDHL3Beo+KiQ9NR\nRTg1GmBSRnxWU/QEMzKnUtlOf7yKMtiMzd89iLv7QvcYRPcWKLzXFpx5FC/REw1B\n2zzXp0kGx1EtbqRGooW+kariMNXGofpgYBjA8kDSqYD+AAFsAHpk0guMpBrFHLOk\nSBhsEUi0CEBjkpA6W1F57tnBtwKBgQDHrpsaOU4G0cB4XslZYm5kTmaWdhVe2Elo\nJQ7LqpyDBf5j3tOJ2mq18agH1XslaJ3jeWbdYNvF/knBSyaWby2Wv+hY9jGQOGNe\nn/oay3qAhgCSPlF8BB7MWM+Ierm7YWKZ/e+YTn1GoO5nhXy+zred9jPHk+SF3uEo\nuocEzs8EKwKBgQCRVg8NEJ6yUzcZe5ValqYYtTGuk97I6eH+3zMCJYJS5H8hZDXC\n1+qOaMiQdZSBWEI7bmVrfKjeVcjRkVONuUz2acdbNyIy8u8hApQ/e6DDMo626SzK\nXxG9P0ZdwKFiggBTAkidXSkzCQk9VdluBl58RvUDnVyIqEjMTYn1T6eQKwKBgQCZ\ntT6PoSz+8tdF0TENLUfszq0JhTxOFg/rqxsIi/yOnz6DgjM0Gn2qMKs33I0+7pkb\nUYhtQPHsJyJ/OGorwslFEdS5Jkpgygcz/9F2bsuNw5kM+gufe0x54KNgW5g9NWnB\nQEf+5expQdhCt+6esmGFps+VAbMXmcmYoHzupoOUoQKBgAhOchldeOfqyYbKXIW8\n+Aug7xouqAs/7RzwZVj9dVcwkY4a04QSWPJrB5HIA/p1st6acT6PkN6mSXf5/Isd\n/m+r7/9o6xOAhS6CQmveUk7gbcPUn/bhqXZic10c9xldAEHceo80MrzdCTePJsaY\ntbrUwaHUAX/sjLGwMZrBidFC\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-6xhom@citadinodsv.iam.gserviceaccount.com",
    client_id: "118248862620911269345",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://accounts.google.com/o/oauth2/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6xhom%40citadinodsv.iam.gserviceaccount.com"
  }),
  databaseURL: "https://citadinodsv.firebaseio.com"
});
const db = admin.database();


var result = 0;

exports.vitrine = function(){
    var update = {};
    var paramExclusao=100; // --- Acima de quantos registros deve-se excluir
    var contador=0;
    var objAnuncio;
    var indAnuncios=0;
    var totalReg=0;
    var totalExclusao=0;
    var obj;
    // Busca os municipíos cadastrados na vitrine
    var data = new Date();
    console.log('Verificando a vitrine...', data);
    db.ref('/vitrine').orderByKey().once('value', function(municipios) {
        if(municipios.val()) {
          // Percorre todos os municípios e verifica os anúncios cadastrados
          municipios.forEach(function(municipio) {
            contador=0; // inicializado o contador de anúncios dentro de cada município
            // Captura todos os anúncios dentro do município
            db.ref(`/vitrine/${municipio.key}`).orderByChild('vitr_dt_agendada').once('value', function(anuncios) {
              if(anuncios.val()) {
                // --- Calculando quantidade de registros para exclusão
                obj = JSON.parse(JSON.stringify(anuncios.val()));
                indAnuncios = Object.keys(obj);
                totalReg = indAnuncios.length;
                if (totalReg > paramExclusao) {
                  console.log('Excluindo registros da vitrine...');
                  totalExclusao=totalReg-paramExclusao;
                  // --- Faz a contagem dos anúncios publicados 
                  anuncios.forEach(function(publicado) {
                    contador++;
                    objAnuncio = publicado.val();
                    if(contador<=totalExclusao) {
                      update[`/vitrine/${municipio.key}/${publicado.key}`] = null;
                    }
                  })
                  // --- Excluindo registros
                  db.ref().update(update);
                }
              }
            });
          }); 
        }
      }, function (errorObject) {
        console.log("Problemas na leitura: " + errorObject.code);
      });
}