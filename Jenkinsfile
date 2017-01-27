node {
stage: 'Clean'
sh "rm dist -rf"

stage 'Checkout Repository'
git url: 'https://github.com/stackroute/oxygen.git', branch: "${env.BRANCH_NAME}"

stage 'Installing Dependencies'
sh "npm prune"
sh "npm install"

stage 'Building'
sh "npm run lint"

stage 'Testing'
sh "npm test"

stage 'Build'
sh "mkdir dist -p"
sh "cp package.json dist && cd dist && tar cvzf oxygen-${env.BRANCH_NAME}.tar.gz *"
step([$class: 'ArtifactArchiver', artifacts: 'dist/*.tar.gz', fingerprint: true])
}
