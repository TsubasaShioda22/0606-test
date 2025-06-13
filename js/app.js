// TaskMaster Application JavaScript

class TaskManager {
  constructor() {
    this.tasks = this.getTasksFromStorage()
    this.currentTab = "all"
    this.init()
  }

  init() {
    this.setupTabSwitching()
    this.setupTaskActions()
    this.renderTasks()
  }

  // タブ切り替え機能
  setupTabSwitching() {
    const tabButtons = document.querySelectorAll(".nav-link")

    tabButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()

        // アクティブなタブを更新
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")

        // タブの種類を取得
        const tabType = button.getAttribute("data-tab")
        this.currentTab = tabType

        // コンテンツを表示
        this.showTabContent(tabType)
      })
    })
  }

  // タブコンテンツの表示
  showTabContent(tabType) {
    const allContents = document.querySelectorAll(".tab-content")
    allContents.forEach((content) => {
      content.style.display = "none"
    })

    const targetContent = document.querySelector(`.tab-content.${tabType}`)
    if (targetContent) {
      targetContent.style.display = "block"
    }

    this.renderTasks()
  }

  // タスクのレンダリング
  renderTasks() {
    if (this.currentTab === "all") {
      this.renderAllTasks()
    } else if (this.currentTab === "team1") {
      this.renderTeamTasks("team1")
    } else if (this.currentTab === "team2") {
      this.renderTeamTasks("team2")
    }
  }

  // 全タスクの表示
  renderAllTasks() {
    const team1Table = document.querySelector(".all .team1-table tbody")
    const team2Table = document.querySelector(".all .team2-table tbody")

    if (team1Table) {
      team1Table.innerHTML = this.generateTaskRows(this.tasks.team1)
    }
    if (team2Table) {
      team2Table.innerHTML = this.generateTaskRows(this.tasks.team2)
    }
  }

  // チーム別タスクの表示
  renderTeamTasks(team) {
    const tableBody = document.querySelector(`.${team} .task-table tbody`)
    if (tableBody) {
      tableBody.innerHTML = this.generateTaskRows(this.tasks[team])
    }
  }

  // タスク行のHTML生成
  generateTaskRows(tasks) {
    if (!tasks || tasks.length === 0) {
      return `<tr><td colspan="4" class="text-center">タスクがありません</td></tr>`
    }

    return tasks
      .map(
        (task) => `
            <tr data-task-id="${task.id}">
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td><span class="status status-${task.status}">${this.getStatusText(task.status)}</span></td>
                <td class="actions">
                    <a href="edit-task.html?id=${task.id}" class="" title="Edit">
  <i class="fas fa-pencil-alt"></i>
</a>
<button class="delete-btn" onclick="taskManager.deleteTask(${task.id})" title="Delete">
  <i class="fas fa-trash-alt"></i>
</button>
                </td>
            </tr>
        `,
      )
      .join("")
  }

  // ステータステキストの取得
  getStatusText(status) {
    const statusMap = {
      "in-progress": "In Progress",
      "not-started": "Not Started",
      completed: "Completed",
    }
    return statusMap[status] || status
  }

  // タスクアクションの設定
  setupTaskActions() {
    // 削除ボタンのイベントは動的に生成されるため、
    // イベント委譲を使用
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const taskId = Number.parseInt(e.target.closest("tr").dataset.taskId)
        this.deleteTask(taskId)
      }
    })
  }

  // タスクの削除
  deleteTask(taskId) {
    if (!confirm("このタスクを削除しますか？")) return

    const team = this.getTaskTeam(taskId)
    if (team) {
      this.tasks[team] = this.tasks[team].filter((task) => task.id !== taskId)
      this.saveTasksToStorage()
      this.renderTasks()
      this.showNotification("タスクが削除されました", "success")
    }
  }

  // タスクIDからタスクを検索
  findTaskById(taskId) {
    for (const team in this.tasks) {
      const task = this.tasks[team].find((t) => t.id === taskId)
      if (task) return task
    }
    return null
  }

  // タスクのチームを取得
  getTaskTeam(taskId) {
    for (const team in this.tasks) {
      if (this.tasks[team].find((t) => t.id === taskId)) {
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
    localStorage.setItem("taskmaster_tasks", JSON.stringify(this.tasks))
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

// アプリケーションの初期化
let taskManager

document.addEventListener("DOMContentLoaded", () => {
  taskManager = new TaskManager()
})

// グローバル関数（HTMLから呼び出し用）
window.taskManager = taskManager
