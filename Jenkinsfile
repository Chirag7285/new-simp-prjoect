pipeline {
  agent any

  environment {
    APP_HOST = "65.2.39.0"
    APP_USER = "ec2-user"
    APP_DIR  = "/home/ec2-user/new-simp-prjoect"
    KEY_PATH = "/var/lib/jenkins/devopstask1.pem"
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

    stage('Deploy to EC2') {
      steps {
        sh '''
          set -e
          echo "Deploying to ${APP_HOST}..."

          ssh -i "${KEY_PATH}" -o StrictHostKeyChecking=no ${APP_USER}@${APP_HOST} "
            set -e
            cd ${APP_DIR}
            git pull
            npm ci
            npm run build
            pm2 restart all || pm2 start npm --name app -- start
          "
        '''
      }
    }

    stage('Done') {
      steps {
        echo "✅ Pipeline completed successfully chirag."
      }
    }
  }

  post {
    failure {
      echo "❌ Pipeline failed. Check logs above."
    }
  }
}
