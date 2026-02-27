pipeline {
  agent any

  environment {
    APP_HOST = "65.2.39.0"
    APP_USER = "ec2-user"
    APP_DIR  = "/home/ec2-user/new-simp-prjoect"
    REPO_URL = "https://github.com/Chirag7285/new-simp-prjoect.git"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install dependencies') {
      steps { sh 'npm ci' }
    }

    stage('Build') {
      steps { sh 'npm run build' }
    }

    stage('Print success') {
      steps { echo 'Build Successful' }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent(credentials: ['app-ssh']) {
          sh """
            ssh -o StrictHostKeyChecking=no ${APP_USER}@${APP_HOST} '
              set -e
              if [ ! -d "${APP_DIR}" ]; then
                git clone ${REPO_URL} ${APP_DIR}
              fi

              cd ${APP_DIR}
              git fetch --all
              git reset --hard origin/main

              npm ci
              npm run build

              pm2 start server.js --name calculator-app --update-env || pm2 restart calculator-app --update-env
              pm2 save
            '
          """
        }
      }
    }
  }
}
