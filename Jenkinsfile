pipeline {
  agent any

  environment {
    APP_HOST = '65.2.39.0'
    APP_DIR  = '/home/ec2-user/new-simp-prjoect'
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

    stage('Deploy to EC2') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: 'ec2-ssh',
            keyFileVariable: 'KEYFILE',
            usernameVariable: 'SSHUSER'
          )
        ]) {
          sh """
            set -e
            echo "Deploying to ${APP_HOST}..."
            ssh -i "\$KEYFILE" -o StrictHostKeyChecking=no "\$SSHUSER@${APP_HOST}" '
              set -e
              cd ${APP_DIR}
              git pull
              npm ci
              npm run build
              pm2 restart all || pm2 start npm --name app -- start
            '
          """
        }
      }
    }

    stage('Done') {
      steps { echo 'Build + Deploy Successful' }
    }
  }
}
