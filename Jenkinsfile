

def app_ver
pipeline {
  agent any
  stages {
   
    stage('Build Image'){
        steps{
             script {
        def pkg = readJSON file: 'package.json'
         app_ver  = pkg.version 
             }
sh "docker build -t 9502044626/chat-room-api:$app_ver ."
        }
        
    }
    stage('Deploy'){
        steps{
            sh "docker rm -f chat-room-api || true"
            sh "docker run -p 3033:3033 --name chat-room-api -d 9502044626/chat-room-api:$app_ver"
           

        }
    }
}
}
