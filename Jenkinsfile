pipeline {
  agent any

  environment {
    APP_HOST = "65.2.39.0"
    APP_DIR  = "/home/ec2-user/new-simp-prjoect"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Print success') {
      steps {
        echo 'Build Successful'
      }
    }

    stage('Deploy to EC2') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: 'app-ssh',
            keyFileVariable: 'KEYFILE',
            usernameVariable: 'SSHUSER'
          )
        ]) {
          sh """
            echo "Deploying to ${APP_HOST}..."
            ssh -i "\$KEYFILE" -o StrictHostKeyChecking=no "\$SSHUSER@${APP_HOST}" '
              set -e

              echo "On EC2: \$(hostname)"
              cd ${APP_DIR}

              echo "Pulling latest code..."
              git pull

              echo "Installing dependencies..."
              npm ci

              echo "Building..."
              npm run build

              echo "Restarting app with PM2..."
              pm2 restart calculator-app || pm2 start server.js --name calculator-app
              pm2 save

              echo "Deploy Successful"
            '
          """
        }
      }
    }
  }
}
