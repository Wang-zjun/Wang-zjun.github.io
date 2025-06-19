// 新增Firebase配置（需要先创建Firebase项目）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 修改后的登录验证函数
async function login() {
  const username = document.getElementById('username').value.trim();
  const snapshot = await database.ref('members').once('value');
  const members = snapshot.val() || [];
  
  if (members.includes(username)) {
    localStorage.setItem('currentUser', username);
    if (username === "王梓钧") {
      localStorage.setItem('isAdmin', 'true');
      showAdminTools();
    }
    updateLoginState();
  } else {
    showError('未找到该用户，请检查姓名输入');
  }
}

// 实时评论系统
function initComments() {
  const commentRef = database.ref('comments');
  commentRef.on('value', (snapshot) => {
    const comments = snapshot.val() || [];
    renderComments(comments);
  });
}

// 提交评论
async function submitComment(content) {
  const user = localStorage.getItem('currentUser');
  if (!user) return;

  const newComment = {
    author: user,
    content: content,
    timestamp: Date.now()
  };

  await database.ref('comments').push(newComment);
}