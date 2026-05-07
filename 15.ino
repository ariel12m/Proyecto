#define BLYNK_TEMPLATE_ID "TMPL2FQfTrByl"
#define BLYNK_TEMPLATE_NAME "DetectorSueno"
#define BLYNK_AUTH_TOKEN "26p9vCdXrwi5oV-5WgqzBG7aZ2viMJLO"

#include <Wire.h>
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <MPU6050.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <math.h>

// ---------------- WIFI ----------------
char ssid[] = "Red_Software";
char pass[] = "S0ft2026t$c.";
char auth[] = BLYNK_AUTH_TOKEN;

BlynkTimer timer;

// ---------------- SENSORES ----------------
MPU6050 mpu;
MAX30105 particleSensor;

#define BUZZER 25

// MPU6050
int16_t ax, ay, az, gx, gy, gz;
float pitch = 0;
float roll = 0;

// MAX30102
int bpm = 0;
float spo2 = 0;
long irValue;

// BPM estable
#define RATE_SIZE 4

int rates[RATE_SIZE];
int rateSpot = 0;
long lastBeat = 0;

// ---------------- ALERTAS ----------------
int Alerta = 0;

// ---------------- FUNCIONES ----------------

// cálculo rápido de inclinación
void calcularMetricas() {

  float newPitch = atan2(ax, sqrt(ay * ay + az * az)) * 180 / PI;
  float newRoll  = atan2(ay, sqrt(ax * ax + az * az)) * 180 / PI;

  // respuesta rápida
  pitch = (pitch * 0.55) + (newPitch * 0.45);
  roll  = (roll  * 0.55) + (newRoll  * 0.45);

  if (abs(pitch) < 1) pitch = 0;
  if (abs(roll) < 1) roll = 0;
}

// lectura MAX30102
void leerMAX30102() {

  irValue = particleSensor.getIR();

  // dedo no detectado
  if (irValue < 12000) {
    bpm = 0;
    spo2 = 0;
    return;
  }

  // detección BPM
  if (checkForBeat(irValue)) {

    long delta = millis() - lastBeat;
    lastBeat = millis();

    float beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute > 40 && beatsPerMinute < 180) {

      rates[rateSpot++] = (int)beatsPerMinute;

      rateSpot %= RATE_SIZE;

      int suma = 0;

      for (int i = 0; i < RATE_SIZE; i++) {
        suma += rates[i];
      }

      bpm = suma / RATE_SIZE;
    }
  }

  // simulación SpO2
  // reemplaza luego con cálculo real
  spo2 = random(94, 100);
}

// detección rápida
void detectarSomnolencia() {

  bool alertaMPU = false;
  bool alertaPulso = false;
  bool alertaSpO2 = false;

  // cabeza inclinada
  if (abs(pitch) > 20 || abs(roll) > 20) {
    alertaMPU = true;
  }

  // pulso bajo
  if (bpm > 0 && bpm < 55) {
    alertaPulso = true;
  }

  // oxigenación baja
  if (spo2 > 0 && spo2 < 96) {
    alertaSpO2 = true;
  }

  bool alertaActual = alertaMPU || alertaPulso || alertaSpO2;

  if (alertaActual) {

    digitalWrite(BUZZER, HIGH);
    Alerta = 1;

  } else {

    digitalWrite(BUZZER, LOW);
    Alerta = 0;
  }

  // monitor serial
  Serial.println("=========== ESTADO ===========");

  Serial.print("Pitch: ");
  Serial.print(pitch);

  Serial.print(" | Roll: ");
  Serial.println(roll);

  Serial.print("BPM: ");
  Serial.print(bpm);

  Serial.print(" | SpO2: ");
  Serial.println(spo2);

  if (alertaMPU) {
    Serial.println("ALERTA: Cabeza inclinada");
  }

  if (alertaPulso) {
    Serial.println("ALERTA: BPM bajo");
  }

  if (alertaSpO2) {
    Serial.println("ALERTA: Oxigenacion baja");
  }

  Serial.print("Alerta General: ");
  Serial.println(Alerta);

  Serial.println("=============================\n");
}

// lectura sensores
void leerSensores() {

  // leer MPU6050
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  calcularMetricas();

  // leer MAX30102
  leerMAX30102();

  // detectar somnolencia
  detectarSomnolencia();

  // enviar a Blynk
  Blynk.virtualWrite(V0, pitch);
  Blynk.virtualWrite(V1, roll);
  Blynk.virtualWrite(V5, Alerta);
  Blynk.virtualWrite(V7, bpm);
  Blynk.virtualWrite(V8, spo2);
}

// ---------------- SETUP ----------------
void setup() {

  Serial.begin(115200);

  Wire.begin(26, 27);

  pinMode(BUZZER, OUTPUT);

  // iniciar MPU6050
  mpu.initialize();

  if (!mpu.testConnection()) {

    Serial.println("ERROR: MPU6050 no conectado");

    while (1);
  }

  // iniciar MAX30102
  if (!particleSensor.begin(Wire)) {

    Serial.println("ERROR: MAX30102 no encontrado");

    while (1);
  }

  particleSensor.setup(60, 4, 2, 100, 411, 4096);

  // conectar WiFi
  WiFi.begin(ssid, pass);

  Serial.print("Conectando WiFi");

  while (WiFi.status() != WL_CONNECTED) {

    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado");

  // conectar Blynk
  Blynk.config(auth);

  if (Blynk.connect(5000)) {

    Serial.println("Blynk conectado");

  } else {

    Serial.println("No se pudo conectar a Blynk");
  }

  // lectura rápida
  timer.setInterval(120L, leerSensores);
}

// ---------------- LOOP ----------------
void loop() {

  Blynk.run();

  timer.run();
}
