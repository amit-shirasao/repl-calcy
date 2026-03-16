pipeline {
  agent any

  options {
    disableConcurrentBuilds(abortPrevious: true)
    skipDefaultCheckout(true)
  }

  tools {
    nodejs 'NodeJS 24.8.0'
  }

  environment {
    IMAGE_NAME = "calculator-repl-image"
    CONTAINER_NAME = "calculator-repl-container"
  }

  stages {

    stage('Clean') {
      steps {
        cleanWs(disableDeferredWipeout: true)
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t ${IMAGE_NAME} ."
        }
      }
    }

    stage('Stop Old Container') {
      steps {
        script {
          sh """
          docker stop ${CONTAINER_NAME} || true
          docker rm ${CONTAINER_NAME} || true
          """
        }
      }
    }

    stage('Deploy Container') {
      steps {
        script {
          sh """
          docker run -d \
            --name ${CONTAINER_NAME} \
            ${IMAGE_NAME}
          """
        }
      }
    }

    stage('Smoke Test') {
      steps {
        script {
          sh 'echo "exit" | docker exec -i my-node-app-container node index.js || true'
        }
      }
    }

  }

  post {
    success {
      echo 'Deployment successful! Docker container is running.'
    }
    failure {
      echo 'Pipeline failed. Check the logs for errors.'
    }
  }
}