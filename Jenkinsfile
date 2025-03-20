pipeline {
    agent any
     tools {
            nodejs 'NodeJS' // Jenkins에서 설정한 Node.js 설치의 이름으로 변경하세요
    }
    stages {
        stage('NPM Build') {
            steps {
                echo '프론트엔드 빌드 실행 중...'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Docker 이미지 생성') {
            steps {
                echo 'Docker 이미지 생성 중...'
                sh 'docker build -t imoong/knockknock-frontend:latest .'
            }
        }

        stage('Docker Hub 로그인 및 푸시') {
            steps {
                echo 'Docker Hub에 이미지 푸시 중...'
                withCredentials([usernamePassword(credentialsId: 'Docker-hub',
                                                  usernameVariable: 'DOCKER_HUB_USER',
                                                  passwordVariable: 'DOCKER_HUB_PASS')]) {
                    sh 'echo $DOCKER_HUB_PASS | docker login -u $DOCKER_HUB_USER --password-stdin'
                    sh 'docker push imoong/knockknock-frontend:latest'
                }
            }
            post {
                always {
                    sh 'docker logout'
                }
            }
        }

        stage('배포') {
            steps {
                echo '프론트엔드 배포 실행 중...'
                sh '''
                    # 배포 대상 디렉토리 존재 여부 확인 후 생성
                    mkdir -p /home/ubuntu/knockknock/frontend

                    # 프론트엔드 .env 파일 생성
                    cat > /home/ubuntu/knockknock/frontend/frontend.env << EOL
# 필요한 환경 변수 설정
EOL

                    # 배포 스크립트 실행
                    cd /home/ubuntu/knockknock/frontend && ./scripts/deploy.sh
                '''
            }
        }
    }

    post {
        success {
            mattermostSend(
                endpoint: 'https://meeting.ssafy.com/hooks/wuqodhw37jnejccnc1bsjso7pc',
                channel: 'gang',
                message: "✅ 프론트엔드 빌드 성공! 😀 \n프로젝트: *KNOCK-KNOCK FRONT*\n브랜치: *develop -> main*\n[빌드 로그 확인](<${env.BUILD_URL}>)"
            )
        }
        failure {
            mattermostSend(
                endpoint: 'https://meeting.ssafy.com/hooks/wuqodhw37jnejccnc1bsjso7pc',
                channel: 'gang',
                message: "❌ 프론트엔드 빌드 실패... 🚨 \n프로젝트: *KNOCK-KNOCK FRONT*\n브랜치: *develop -> main*\n[빌드 로그 확인](<${env.BUILD_URL}>)"
            )
        }
    }
}
