// TaskMaster - Task Form JavaScript

class TaskForm {
  constructor() {
    this.taskData = this.getTasksFromStorage()
    this.init()
  }

  init() {
    // 現在のページを判断
    const isEditPage = window.location.pathname.includes("edit-task.html")

    if (isEditPage) {
      this.setupEditForm()
    } else {
      this.setupAddForm()
    }
  }

  // 編集フォームの設定
  setupEditForm() {
    // URLからタスクIDを取得
    const urlParams = new URLSearchParams(window.location.search)
    const taskId = Number.parseInt(urlParams.get("id"))

    if (!taskId) {
      this.showNotification("タスクが見つかりません", "error")
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 2000)
      return
    }

    // タスクデータを取得
    const task = this.findTaskById(taskId)
    if (!task) {
      this.showNotification("タスクが見つかりません", "error")
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 2000)
      return
    }

    // フォームにタスクデータを設定
    document.getElementById("task-id").value = task.id
    document.getElementById("task-title").value = task.title
    document.getElementById("task-description").value = task.description
    document.getElementById("task-status").value = task.status
    document.getElementById("task-team").value = this.getTaskTeam(taskId)

    // ローディング表示を非表示にしてフォームを表示
    document.getElementById("loading").style.display = "none"
    document.getElementById("task-form").style.display = "block"

    // 更新ボタンのイベントリスナー
    document.getElementById("update-btn").addEventListener("click", () => {
      this.updateTask()
    })
  }

  // 追加フォームの設定
  setupAddForm() {
    // 保存ボタンのイベントリスナー
    document.getElementById("save-btn").addEventListener("click", () => {
      this.saveTask()
    })
  }

  // タスクの保存
  saveTask() {
    const title = document.getElementById("task-title").value.trim()
    const description = document.getElementById("task-description").value.trim()
    const status = document.getElementById("task-status").value
    const team = document.getElementById("task-team").value

    if (!title || !description) {
      this.showNotification("タイトルと説明を入力してください", "error")
      return
    }

    // 新規タスクの作成
    const newTask = {
      id: Date.now(),
      title,
      description,
      status,
    }

    // タスクをチームに追加
    this.taskData[team].push(newTask)

    // ストレージに保存
    this.saveTasksToStorage()

    this.showNotification("タスクが追加されました", "success")

    // ダッシュボードに戻る
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1500)
  }

  // タスクの更新
  updateTask() {
    const taskId = Number.parseInt(document.getElementById("task-id").value)
    const title = document.getElementById("task-title").value.trim()
    const description = document.getElementById("task-description").value.trim()
    const status = document.getElementById("task-status").value
    const newTeam = document.getElementById("task-team").value

    if (!title || !description) {
      this.showNotification("タイトルと説明を入力してください", "error")
      return
    }

    // 現在のチームを取得
    const currentTeam = this.getTaskTeam(taskId)

    if (currentTeam === newTeam) {
      // 同じチーム内での更新
      const task = this.findTaskById(taskId)
      if (task) {
        task.title = title
        task.description = description
        task.status = status
      }
    } else {
      // チーム間の移動
      const task = this.findTaskById(taskId)
      if (task) {
        // 元のチームから削除
        this.taskData[currentTeam] = this.taskData[currentTeam].filter((t) => t.id !== taskId)

        // 新しいタスクオブジェクトを作成
        const updatedTask = {
          id: taskId,
          title,
          description,
          status,
        }

        // 新しいチームに追加
        this.taskData[newTeam].push(updatedTask)
      }
    }

    // ストレージに保存
    this.saveTasksToStorage()

    this.showNotification("タスクが更新されました", "success")

    // ダッシュボードに戻る
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1500)
  }

  // タスクIDからタスクを検索
  findTaskById(taskId) {
    for (const team in this.taskData) {
      const task = this.taskData[team].find((t) => t.id === taskId)
      if (task) return task
    }
    return null
  }

  // タスクのチームを取得
  getTaskTeam(taskId) {
    for (const team in this.taskData) {
      if (this.taskData[team].find((t) => t.id === taskId)) {
        return team
      }
    }
    return null
  }

  // ローカルストレージからタスクを取得
  getTasksFromStorage() {
    const storedTasks = localStorage.getItem("taskmaster_tasks")

    if (storedTasks) {
      return JSON.parse(storedTasks)
    }

    // デフォルトのタスクデータ
    return {
      team1: [
        {
          id: 1,
          title: "Grocery Shopping",
          description: "Buy milk, eggs, and bread",
          status: "in-progress",
        },
        {
          id: 2,
          title: "Book Appointment",
          description: "Schedule a doctor's check-up",
          status: "not-started",
        },
        {
          id: 3,
          title: "Pay Bills",
          description: "Electricity and internet bills",
          status: "not-started",
        },
        {
          id: 4,
          title: "Plan Vacation",
          description: "Research destinations and book flights",
          status: "not-started",
        },
        {
          id: 5,
          title: "Renew Subscription",
          description: "Streaming service renewal",
          status: "not-started",
        },
        {
          id: 6,
          title: "Schedule Meeting",
          description: "Team sync-up for project updates",
          status: "not-started",
        },
        {
          id: 7,
          title: "Update Resume",
          description: "Add recent work experience",
          status: "not-started",
        },
      ],
      team2: [
        {
          id: 8,
          title: "Prepare Presentation",
          description: "Create slides for the upcoming client meeting",
          status: "in-progress",
        },
        {
          id: 9,
          title: "Review Documents",
          description: "Check and approve the latest project documents",
          status: "not-started",
        },
        {
          id: 10,
          title: "Coordinate Event",
          description: "Organize the team-building activity",
          status: "not-started",
        },
        {
          id: 11,
          title: "Update Website",
          description: "Refresh content on the company website",
          status: "not-started",
        },
        {
          id: 12,
          title: "Conduct Research",
          description: "Gather data for the market analysis report",
          status: "not-started",
        },
        {
          id: 13,
          title: "Train New Members",
          description: "Onboard new team members with training sessions",
          status: "not-started",
        },
        {
          id: 14,
          title: "Analyze Feedback",
          description: "Review customer feedback and identify areas for improvement",
          status: "not-started",
        },
      ],
    }
  }

  // ローカルストレージにタスクを保存
  saveTasksToStorage() {
    localStorage.setItem("taskmaster_tasks", JSON.stringify(this.taskData))
  }

  // 通知を表示
  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    document.body.appendChild(notification)

    // アニメーション
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    // 3秒後に削除
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }
}

// フォームの初期化
document.addEventListener("DOMContentLoaded", () => {
  new TaskForm()
})
