pipeline {
    agent any

    stages {
        stage('Check') {
            steps {
                sh 'npm run check'
            }
        }

        stage('Health probe') {
            steps {
                sh '''
                    node server.js > jenkins-server.log 2>&1 &
                    SERVER_PID=$!
                    trap 'kill $SERVER_PID' EXIT
                    for attempt in 1 2 3 4 5; do
                        curl --fail --silent http://localhost:3000/health && exit 0
                        sleep 1
                    done
                    exit 1
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'jenkins-server.log', allowEmptyArchive: true
        }
    }
}