pipeline {
    agent any
    tools {
        nodejs 'nodejs-22.12.0' // Jenkins에서 설정한 Node.js 설치의 이름
    }
    stages {
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
            script {
                // 간결한 브랜치 이름 얻기
                def fullBranch = sh(script: 'git name-rev --name-only HEAD', returnStdout: true).trim()
                def gitBranch = fullBranch.replaceAll('remotes/origin/', '').replaceAll('refs/heads/', '')

                def gitCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                def commitAuthor = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()

                // 시간을 조정된 형식으로 포맷
                def koreaTime = new Date(System.currentTimeMillis() + 9 * 60 * 60 * 1000)
                def formattedTime = koreaTime.format('yyyy-MM-dd HH:mm')

                mattermostSend(
                    endpoint: 'https://meeting.ssafy.com/hooks/wuqodhw37jnejccnc1bsjso7pc',
                    channel: 'gang',
                    icon: ':jenkins:',
                    color: '#36a64f',
                    text: ":white_check_mark: **프론트엔드 빌드 성공!** :tada:\n" +
                          "--------------------------------------------------\n" +
                          ":mag: [빌드 로그 확인](${env.BUILD_URL})\n" +
                          ":chart_with_upwards_trend: [트렌드 보기](${env.BUILD_URL}trend)\n" +
                          ":page_with_curl: [소스 코드 변경사항](${env.BUILD_URL}changes)",
                    message: "**프로젝트:** KNOCK-KNOCK FRONTEND\n" +
                             "**브랜치:** ${gitBranch}\n" +
                             "**커밋:** ${gitCommit} - ${commitMsg}\n" +
                             "**작성자:** ${commitAuthor}\n" +
                             "**빌드 번호:** #${env.BUILD_NUMBER}\n" +
                             "**빌드 시간:** ${formattedTime}"
                )
            }
        }
        failure {
            script {
                // 간결한 브랜치 이름 얻기
                def fullBranch = sh(script: 'git name-rev --name-only HEAD', returnStdout: true).trim()
                def gitBranch = fullBranch.replaceAll('remotes/origin/', '').replaceAll('refs/heads/', '')

                def gitCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                def commitAuthor = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()

                // 시간을 조정된 형식으로 포맷
                def koreaTime = new Date(System.currentTimeMillis() + 9 * 60 * 60 * 1000)
                def formattedTime = koreaTime.format('yyyy-MM-dd HH:mm')

                mattermostSend(
                    endpoint: 'https://meeting.ssafy.com/hooks/wuqodhw37jnejccnc1bsjso7pc',
                    channel: 'gang',
                    icon: ':jenkins:',
                    color: '#e01e5a',
                    text: ":x: **프론트엔드 빌드 실패!** :warning:\n" +
                          "--------------------------------------------------\n" +
                          ":mag: [빌드 로그 확인](${env.BUILD_URL})\n" +
                          ":bug: [콘솔 출력 확인](${env.BUILD_URL}console)\n" +
                          ":wrench: [테스트 결과](${env.BUILD_URL}testReport)",
                    message: "**프로젝트:** KNOCK-KNOCK FRONTEND\n" +
                             "**브랜치:** ${gitBranch}\n" +
                             "**커밋:** ${gitCommit} - ${commitMsg}\n" +
                             "**작성자:** ${commitAuthor}\n" +
                             "**빌드 번호:** #${env.BUILD_NUMBER}\n" +
                             "**빌드 시간:** ${formattedTime}"
                )
            }
        }
    }
}