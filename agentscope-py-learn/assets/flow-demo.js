/* 00A 信息流实验室：L1 最小 reply → L2 服务化 → L3 生产化（零依赖） */
(function () {
  "use strict";

  var root = document.getElementById("fd");
  if (!root) return;

  var NODES = {
    input: {
      name: "UserMsg",
      title: "输入：一条 UserMsg",
      input: "字符串、文本块或多模态 DataBlock",
      output: "UserMsg(role=user, content=[...])",
      next: "Agent.reply_stream(msg)",
      link: "03-message-event.html",
      linkText: "03 消息与事件",
    },
    agent: {
      name: "Agent",
      title: "Agent 收到消息",
      input: "Msg + AgentState",
      output: "ReplyStartEvent + 本轮上下文",
      next: "中间件 / _prepare_model_input",
      link: "02-first-agent.html",
      linkText: "02 第一个 Agent",
    },
    context: {
      name: "Context",
      title: "拼模型输入",
      input: "历史消息 + system prompt + tools",
      output: "messages / tools / tool_choice",
      next: "ChatModel.__call__",
      link: "06-context.html",
      linkText: "06 上下文",
    },
    model: {
      name: "ChatModel",
      title: "模型第一次推理",
      input: "messages + tools",
      output: "文本 + ToolCallBlock 或最终文本",
      next: "PermissionEngine",
      link: "04-model.html",
      linkText: "04 模型",
    },
    permission: {
      name: "Permission",
      title: "权限判定",
      input: "ToolCallBlock",
      output: "allow / ask / deny",
      next: "Toolkit 或 HITL",
      link: "08-permission-hitl.html",
      linkText: "08 权限与 HITL",
    },
    tool: {
      name: "Toolkit",
      title: "工具执行",
      input: "工具名 + 参数",
      output: "ToolResultBlock(state=success/error)",
      next: "回填上下文，进入下一轮",
      link: "05-tool.html",
      linkText: "05 工具系统",
    },
    model2: {
      name: "ChatModel 2",
      title: "模型第二次推理",
      input: "上下文 + ToolResultBlock",
      output: "最终 assistant Msg",
      next: "AgentState / 事件流",
      link: "02-first-agent.html",
      linkText: "02 第一个 Agent",
    },
    state: {
      name: "AgentState",
      title: "状态与事件",
      input: "最终 Msg + 本轮 usage",
      output: "context 保存 + ReplyEndEvent",
      next: "调用方拿最终消息",
      link: "03-message-event.html",
      linkText: "03 消息与事件",
    },
    output: {
      name: "Output",
      title: "返回调用方",
      input: "事件流 + 最终 Msg",
      output: "get_text_content() / SSE 帧",
      next: "业务代码或前端",
      link: "16-session-sse.html",
      linkText: "16 会话与 SSE",
    },

    session: {
      addedAt: 2,
      name: "Session",
      title: "会话与身份",
      input: "user_id / agent_id / session_id",
      output: "会话记录 + 权限上下文",
      next: "Workspace",
      link: "15-agent-service.html",
      linkText: "15 Agent Service",
    },
    workspace: {
      addedAt: 2,
      name: "Workspace",
      title: "工作区装配",
      input: "文件、MCP、技能、卸载内容",
      output: "工具面 + 文件系统 + 技能说明",
      next: "Agent 组装",
      link: "12-workspace.html",
      linkText: "12 工作区与沙箱",
    },
    middleware: {
      addedAt: 2,
      name: "Middleware",
      title: "中间件洋葱",
      input: "Agent + input_kwargs",
      output: "可改写输入 / 观察事件 / 注入工具",
      next: "Context",
      link: "07-middleware.html",
      linkText: "07 中间件",
    },
    offload: {
      addedAt: 2,
      name: "Offloader",
      title: "压缩与卸载",
      input: "长上下文 / 超大工具结果",
      output: "摘要或工作区文件引用",
      next: "下一轮 Context",
      link: "06-context.html",
      linkText: "06 上下文",
    },
    sse: {
      addedAt: 2,
      name: "SSE",
      title: "事件流回放",
      input: "AgentEvent",
      output: "按会话分发的 SSE 帧",
      next: "前端 / 渠道",
      link: "16-session-sse.html",
      linkText: "16 会话与 SSE",
    },

    auth: {
      addedAt: 3,
      name: "Auth",
      title: "鉴权与身份",
      input: "JWT / OAuth / X-User-ID",
      output: "可信 user_id",
      next: "Gateway",
      link: "23-production.html",
      linkText: "23 生产化",
    },
    gateway: {
      addedAt: 3,
      name: "Gateway",
      title: "网关与限流",
      input: "HTTP / IM 事件",
      output: "路由到会话 + 配额检查",
      next: "Scheduler / Input",
      link: "23-production.html",
      linkText: "23 生产化",
    },
    scheduler: {
      addedAt: 3,
      name: "Scheduler",
      title: "定时触发",
      input: "Cron / 一次性任务",
      output: "无人类消息也能触发一轮",
      next: "Session",
      link: "15-agent-service.html",
      linkText: "15 Agent Service",
    },
    channel: {
      addedAt: 3,
      name: "Channel",
      title: "IM 渠道",
      input: "飞书 / 钉钉 / Discord 事件",
      output: "统一 Msg + 回复目标",
      next: "Session",
      link: "18-channel.html",
      linkText: "18 消息渠道",
    },
    hubs: {
      addedAt: 3,
      name: "Hubs",
      title: "MCP / 技能中心",
      input: "用户安装的资源",
      output: "资源池 + 工作区装配",
      next: "Workspace",
      link: "19-hub.html",
      linkText: "19 MCP 与技能中心",
    },
    sharing: {
      addedAt: 3,
      name: "Sharing",
      title: "资源共享策略",
      input: "viewer_id + resource refs",
      output: "跨属主可见 / 可编辑",
      next: "Session",
      link: "20-sharing.html",
      linkText: "20 资源与多租户",
    },
    realtime: {
      addedAt: 3,
      name: "Realtime",
      title: "语音会话",
      input: "WebRTC / 本地声卡音频",
      output: "语音事件 + 文本转写",
      next: "Agent / 前端",
      link: "25-realtime.html",
      linkText: "25 实时语音",
    },
    a2a: {
      addedAt: 3,
      name: "A2A",
      title: "外部 Agent",
      input: "Agent Card + 远端 Task",
      output: "远端事件流 + context_id",
      next: "Agent / 调用方",
      link: "24-a2a.html",
      linkText: "24 A2A 协议",
    },
  };

  var LEVELS = {
    minimal: {
      label: "MINIMAL REPLY",
      level: "L1",
      blurb:
        "L1 只有 9 个节点：消息进来，拼上下文，模型决定说话还是调工具，工具结果回填后再让模型收尾。没有 Session、Workspace、SSE。",
      ids: [
        "input",
        "agent",
        "context",
        "model",
        "permission",
        "tool",
        "model2",
        "state",
        "output",
      ],
    },
    service: {
      label: "SERVICE",
      level: "L2",
      blurb:
        "L2 在 L1 的 9 个节点上新增 5 个：Session、Workspace、Middleware、Offloader、SSE。Agent 还是那个 Agent，外围开始工程化。",
      ids: [
        "input",
        "session",
        "workspace",
        "agent",
        "middleware",
        "context",
        "model",
        "permission",
        "tool",
        "offload",
        "model2",
        "state",
        "sse",
        "output",
      ],
    },
    production: {
      label: "PRODUCTION",
      level: "L3",
      blurb:
        "L3 在 L2 的 14 个节点上再加 8 个：Auth、Gateway、Scheduler、Channel、Hubs、Sharing、Realtime、A2A。它们不都在 ReAct 循环里，很多接在触发层与外围。",
      ids: [
        "auth",
        "gateway",
        "scheduler",
        "channel",
        "input",
        "session",
        "workspace",
        "hubs",
        "sharing",
        "agent",
        "middleware",
        "context",
        "model",
        "permission",
        "tool",
        "offload",
        "model2",
        "state",
        "sse",
        "output",
        "realtime",
        "a2a",
      ],
    },
  };

  var modeButtons = root.querySelectorAll(".fd-mode");
  var rail = document.getElementById("fd-rail");
  var blurb = document.getElementById("fd-blurb");
  var stepEl = document.getElementById("fd-step");
  var titleEl = document.getElementById("fd-title");
  var inputEl = document.getElementById("fd-input");
  var outputEl = document.getElementById("fd-output");
  var nextEl = document.getElementById("fd-next-node");
  var linkEl = document.getElementById("fd-link");
  var counterEl = document.getElementById("fd-counter");
  var labelEl = document.getElementById("fd-scenario-label");
  var levelEl = document.getElementById("fd-level");
  var jsonEl = document.getElementById("fd-json");
  var eventsEl = document.getElementById("fd-events");
  var packetEl = document.getElementById("fd-packet");
  var barEl = document.getElementById("fd-bar");
  var railWrap = root.querySelector(".fd-rail-wrap");
  var current = "minimal";
  var index = 0;
  var timer = null;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function nodes() {
    return LEVELS[current].ids.map(function (id) {
      return NODES[id];
    });
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function stopPlay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    playBtn.setAttribute("aria-pressed", "false");
    playBtn.textContent = "▶ 播放";
  }

  function paintRail() {
    rail.innerHTML = "";
    nodes().forEach(function (n, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fd-node";
      b.dataset.i = String(i);
      var badge = n.addedAt
        ? '<span class="fd-badge l' + n.addedAt + '">+L' + n.addedAt + "</span>"
        : "";
      b.innerHTML =
        '<span class="fd-idx">' +
        pad2(i + 1) +
        "</span>" +
        badge +
        '<span class="fd-name">' +
        n.name +
        '</span><span class="fd-out">' +
        n.output +
        "</span>";
      b.addEventListener("click", function () {
        stopPlay();
        select(i);
      });
      rail.appendChild(b);
    });
  }

  function positionPacket() {
    var active = rail.querySelector(".fd-node.active");
    if (!active || !railWrap) {
      packetEl.classList.remove("on");
      return;
    }
    var wr = railWrap.getBoundingClientRect();
    var ar = active.getBoundingClientRect();
    packetEl.style.left = ar.left - wr.left + ar.width / 2 - 4 + "px";
    packetEl.classList.add("on");
  }

  function paintEvents() {
    if (!eventsEl) return;
    eventsEl.innerHTML = "";
    var from = Math.max(0, index - 6);
    nodes()
      .slice(from, index + 1)
      .forEach(function (n) {
        var chip = document.createElement("span");
        chip.className = "fd-event";
        chip.textContent = n.name;
        eventsEl.appendChild(chip);
      });
  }

  function select(i) {
    index = Math.max(0, Math.min(nodes().length - 1, i));
    var list = rail.querySelectorAll(".fd-node");
    for (var k = 0; k < list.length; k++) {
      list[k].classList.toggle("active", k === index);
      list[k].classList.toggle("done", k < index);
      if (k === index) list[k].setAttribute("aria-current", "step");
      else list[k].removeAttribute("aria-current");
    }
    var n = nodes()[index];
    var len = nodes().length;
    stepEl.textContent = "步骤 " + (index + 1) + " / " + len;
    counterEl.textContent = pad2(index + 1) + " / " + pad2(len);
    barEl.style.width = ((index + 1) / len) * 100 + "%";
    titleEl.textContent = n.title;
    inputEl.textContent = n.input;
    outputEl.textContent = n.output;
    nextEl.textContent = n.next;
    jsonEl.textContent = JSON.stringify(
      {
        step: index + 1,
        node: n.name,
        addedAt: n.addedAt || 1,
        input: n.input,
        output: n.output,
        next: n.next,
      },
      null,
      2
    );
    paintEvents();
    linkEl.innerHTML = '对应章节：<a href="' + n.link + '">' + n.linkText + "</a>";
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === len - 1;
    var active = list[index];
    if (active) {
      var left = active.offsetLeft - (rail.clientWidth - active.offsetWidth) / 2;
      if (rail.scrollWidth > rail.clientWidth + 4) {
        rail.scrollTo({
          left: Math.max(0, left),
          behavior: reduce ? "auto" : "smooth",
        });
      }
    }
    requestAnimationFrame(positionPacket);
  }

  function renderScenario(key) {
    stopPlay();
    current = key;
    index = 0;
    modeButtons.forEach(function (b) {
      b.setAttribute(
        "aria-pressed",
        b.dataset.scenario === key ? "true" : "false"
      );
    });
    blurb.textContent = LEVELS[key].blurb;
    labelEl.textContent = LEVELS[key].label;
    levelEl.textContent = LEVELS[key].level;
    eventsEl.innerHTML = "";
    jsonEl.textContent = "";
    paintRail();
    select(0);
  }

  var prevBtn = document.getElementById("fd-prev");
  var nextBtn = document.getElementById("fd-next");
  var playBtn = document.getElementById("fd-play");
  var resetBtn = document.getElementById("fd-reset");

  prevBtn.addEventListener("click", function () {
    stopPlay();
    select(index - 1);
  });
  nextBtn.addEventListener("click", function () {
    stopPlay();
    select(index + 1);
  });
  resetBtn.addEventListener("click", function () {
    stopPlay();
    select(0);
  });
  playBtn.addEventListener("click", function () {
    if (timer) {
      stopPlay();
      return;
    }
    if (index >= nodes().length - 1) select(0);
    playBtn.setAttribute("aria-pressed", "true");
    playBtn.textContent = "❚❚ 暂停";
    timer = setInterval(function () {
      if (index >= nodes().length - 1) {
        stopPlay();
        return;
      }
      select(index + 1);
    }, 1400);
  });

  modeButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      renderScenario(b.dataset.scenario);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!root.contains(document.activeElement)) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      stopPlay();
      select(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      stopPlay();
      select(index - 1);
    }
  });

  rail.addEventListener("scroll", positionPacket, { passive: true });
  window.addEventListener("resize", positionPacket);

  var requested = new URLSearchParams(location.search).get("scenario");
  renderScenario(LEVELS[requested] ? requested : "minimal");
})();
