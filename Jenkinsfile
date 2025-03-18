pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo '빌드 실행 중...'
                // 여기에 빌드 명령어 추가
            }
        }
        stage('Test') {
            steps {
                echo '테스트 실행 중...'
                // 여기에 테스트 실행 명령어 추가
            }
        }
    }

    post {
        success {
            mattermostSend(
                endpoint: 'https://meeting.ssafy.com/hooks/wuqodhw37jnejccnc1bsjso7pc',
                channel: 'gang',
                message: "✅ 빌드 성공! 😀 \n프로젝트: *KNOCK-KNOCK FRONT*\n브랜치: *develop -> main*\n[빌드 로그 확인](<${env.BUILD_URL}>)"
            )
        }
        failure {
            mattermostSend(
                endpoint: 'https://meeting.ssafy.com/hooks/wuqodhw37jnejccnc1bsjso7pc',
                channel: 'gang',
                message: "❌ 빌드 실패... 🚨 \n프로젝트: *KNOCK-KNOCK FRONT*\n브랜치: *develop -> main*\n[빌드 로그 확인](<${env.BUILD_URL}>)"
            )
        }
    }
}