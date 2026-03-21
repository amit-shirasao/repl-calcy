pipeline {
  // Use a Kubernetes pod as the build agent
  agent {
    kubernetes {
      cloud 'k3s'
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: node
            image: node:18
            command: ["sleep"]
            args: ["infinity"]
          - name: kubectl
            image: bitnami/kubectl:latest
            command: ["sleep"]
            args: ["infinity"]
      '''
    }
  }

  options {
    disableConcurrentBuilds(abortPrevious: true)
    skipDefaultCheckout(true)
  }

  environment {
    IMAGE_NAME = "repl-calcy-image:green" // Matches your k8s.yml green version
    APP_NAME   = "repl-calcy-app"
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

    stage('Deploy Green (Testing)') {
      steps {
        container('kubectl') {
          script {
            // Apply the k8s manifest to update/create the Green deployment
            sh "kubectl apply -f k8s.yml"
            
            // Wait for Green pods to be ready
            sh "kubectl rollout status deployment/repl-calcy-green"
          }
        }
      }
    }

    stage('Smoke Test') {
      steps {
        container('node') {
          script {
            // Test against the green deployment
            sh 'echo "exit" | node index.js' 
          }
        }
      }
    }

    stage('Switch Traffic to Green') {
      steps {
        container('kubectl') {
          // Updates the Service selector to point to 'version: green'
          sh "kubectl patch service repl-calcy-service -p '{\"spec\":{\"selector\":{\"version\":\"green\"}}}'"
        }
      }
    }
  }

  post {
    success {
      echo 'Deployment successful! Traffic shifted to Green.'
    }
    failure {
      echo 'Deployment failed. Check logs.'
    }
  }
}