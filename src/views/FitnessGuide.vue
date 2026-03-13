<template>
  <div class="fitness-guide-page">
    <!-- 导航栏 -->
    <div class="guide-nav">
      <div class="nav-content">
        <h2 class="nav-title">📑 健身入门指南</h2>
        <div class="nav-links">
          <a
              v-for="(chapter, index) in chapters"
              :key="index"
              :href="'#' + chapter.id"
              class="nav-link"
              @click.prevent="scrollToChapter(chapter.id)"
          >
            {{ chapter.title }}
          </a>
        </div>
        <div class="progress-indicator">
          <div class="progress-bar" :style="{ width: scrollProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 封面区域 -->
    <div class="hero-section" :style="{ backgroundImage: `url(${heroBg})` }">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">健身入门指南</h1>
        <p class="hero-subtitle">从零开始，科学健身，打造健康体魄</p>
        <div class="hero-meta">
          <span class="meta-item">
            <el-icon><Clock /></el-icon>
            阅读时间：约 5 分钟
          </span>
          <span class="meta-item">
            <el-icon><User /></el-icon>
            适合人群：健身新手
          </span>
        </div>
        <el-button
            type="primary"
            size="large"
            @click="scrollToChapter('chapter1')"
            class="start-reading-btn"
        >
          开始阅读
          <el-icon><ArrowDown /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 目录 -->
    <div class="table-of-contents">
      <div class="container">
        <h3 class="toc-title">
          <el-icon><Menu /></el-icon>
          目录导航
        </h3>
        <div class="toc-grid">
          <div
              v-for="(chapter, index) in chapters"
              :key="index"
              class="toc-card"
              @click="scrollToChapter(chapter.id)"
          >
            <div class="toc-number">0{{ index + 1 }}</div>
            <h4 class="toc-chapter-title">{{ chapter.title }}</h4>
            <p class="toc-desc">{{ chapter.desc }}</p>
            <div class="toc-tags">
              <span class="tag" v-for="tag in chapter.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="article-container">
      <div class="article-content">
        <!-- 第一章 -->
        <section id="chapter1" class="chapter">
          <div class="chapter-header">
            <span class="chapter-number">01</span>
            <h2 class="chapter-title">健身基础概念</h2>
            <p class="chapter-subtitle">了解健身的核心要素和基本原理</p>
          </div>

          <div class="content-block">
            <h3>什么是健身？</h3>
            <p>健身不仅仅是锻炼身体，更是一种科学的生活方式。它包括力量训练、有氧运动、柔韧性训练和营养管理等多个方面。</p>

            <div class="image-card">
              <img
                  :src="fitnessBase"
                  alt="健身基础"
                  loading="lazy"
              >
              <div class="image-caption">科学健身是健康生活的基础</div>
            </div>
          </div>

          <div class="content-block">
            <h3>健身的三大要素</h3>
            <div class="feature-grid">
              <div class="feature-card">
                <div class="feature-icon">
                  <el-icon><TrendCharts /></el-icon>
                </div>
                <h4>力量训练</h4>
                <p>增强肌肉力量和耐力，提高基础代谢率</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <el-icon><Odometer /></el-icon>
                </div>
                <h4>有氧运动</h4>
                <p>改善心肺功能，燃烧脂肪，提高耐力</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <el-icon><Food /></el-icon>
                </div>
                <h4>营养管理</h4>
                <p>合理饮食，为身体提供充足能量和营养</p>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h3>健身频率建议</h3>
            <div class="tip-card">
              <div class="tip-header">
                <el-icon><InfoFilled /></el-icon>
                <span>新手建议</span>
              </div>
              <p>对于健身新手，建议每周训练 3-4 次，每次 45-60 分钟。训练后需要给身体足够的恢复时间。</p>
            </div>
          </div>
        </section>

        <!-- 第二章 -->
        <section id="chapter2" class="chapter">
          <div class="chapter-header">
            <span class="chapter-number">02</span>
            <h2 class="chapter-title">训练原则与方法</h2>
            <p class="chapter-subtitle">掌握科学的训练方法和基本原则</p>
          </div>

          <div class="content-block">
            <h3>渐进超负荷原则</h3>
            <p>这是健身最重要的原则之一。为了持续进步，你需要逐渐增加训练强度。</p>

            <div class="comparison-table">
              <table>
                <thead>
                <tr>
                  <th>训练阶段</th>
                  <th>重量选择</th>
                  <th>组数×次数</th>
                  <th>休息时间</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>新手期</td>
                  <td>60-70% 1RM</td>
                  <td>3×8-12</td>
                  <td>60-90 秒</td>
                </tr>
                <tr>
                  <td>进阶期</td>
                  <td>70-80% 1RM</td>
                  <td>4×6-10</td>
                  <td>90-120 秒</td>
                </tr>
                <tr>
                  <td>提高期</td>
                  <td>80-85% 1RM</td>
                  <td>4-5×4-8</td>
                  <td>120-180 秒</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="content-block">
            <h3>基础训练动作</h3>
            <div class="exercise-list">
              <div class="exercise-item">
                <div class="exercise-image">
                  <img :src=squat alt="深蹲">
                </div>
                <div class="exercise-info">
                  <h4>深蹲 (Squat)</h4>
                  <p><strong>目标肌群：</strong>大腿、臀部、核心</p>
                  <p><strong>要点：</strong>保持背部挺直，膝盖不超过脚尖</p>
                </div>
              </div>
              <div class="exercise-item">
                <div class="exercise-image">
                  <img :src=benchPress alt="卧推">
                </div>
                <div class="exercise-info">
                  <h4>卧推 (Bench Press)</h4>
                  <p><strong>目标肌群：</strong>胸肌、肩部、三头肌</p>
                  <p><strong>要点：</strong>控制下降速度，保持肩胛稳定</p>
                </div>
              </div>
              <div class="exercise-item">
                <div class="exercise-image">
                  <img :src=deadlift alt="硬拉">
                </div>
                <div class="exercise-info">
                  <h4>硬拉 (Deadlift)</h4>
                  <p><strong>目标肌群：</strong>背部、臀部、大腿后侧</p>
                  <p><strong>要点：</strong>保持背部平直，用腿部力量启动</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 第三章 -->
        <section id="chapter3" class="chapter">
          <div class="chapter-header">
            <span class="chapter-number">03</span>
            <h2 class="chapter-title">营养与饮食</h2>
            <p class="chapter-subtitle">合理的营养是健身成功的关键</p>
          </div>

          <div class="content-block">
            <h3>三大营养素</h3>
            <div class="nutrition-cards">
              <div class="nutrition-card protein">
                <div class="nutrition-header">
                  <el-icon><Food /></el-icon>
                  <h4>蛋白质</h4>
                </div>
                <p><strong>作用：</strong>肌肉修复和生长</p>
                <p><strong>推荐摄入：</strong>1.6-2.2g/kg 体重</p>
                <p><strong>食物来源：</strong>鸡胸肉、鱼肉、鸡蛋、豆制品</p>
              </div>
              <div class="nutrition-card carb">
                <div class="nutrition-header">
                  <el-icon><Food /></el-icon>
                  <h4>碳水化合物</h4>
                </div>
                <p><strong>作用：</strong>提供能量</p>
                <p><strong>推荐摄入：</strong>4-6g/kg 体重</p>
                <p><strong>食物来源：</strong>糙米、燕麦、全麦面包、薯类</p>
              </div>
              <div class="nutrition-card fat">
                <div class="nutrition-header">
                  <el-icon><Food /></el-icon>
                  <h4>脂肪</h4>
                </div>
                <p><strong>作用：</strong>激素合成、维生素吸收</p>
                <p><strong>推荐摄入：</strong>0.8-1.2g/kg 体重</p>
                <p><strong>食物来源：</strong>坚果、橄榄油、鱼油、牛油果</p>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h3>饮食时间建议</h3>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-time">训练前 1-2 小时</div>
                <div class="timeline-content">
                  <h5>训练前餐</h5>
                  <p>以碳水化合物为主，适量蛋白质，低脂肪</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-time">训练后 30 分钟内</div>
                <div class="timeline-content">
                  <h5>训练后餐</h5>
                  <p>快速吸收的蛋白质和碳水化合物</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-time">日常饮食</div>
                <div class="timeline-content">
                  <h5>规律进食</h5>
                  <p>每天 3-5 餐，保持血糖稳定</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 第四章 -->
        <section id="chapter4" class="chapter">
          <div class="chapter-header">
            <span class="chapter-number">04</span>
            <h2 class="chapter-title">常见误区与建议</h2>
            <p class="chapter-subtitle">避开陷阱，科学健身</p>
          </div>

          <div class="content-block">
            <h3>常见健身误区</h3>
            <div class="myth-list">
              <div class="myth-item myth-false">
                <div class="myth-header">
                  <el-icon><Close /></el-icon>
                  <h4>误区一：练得越多越好</h4>
                </div>
                <p><strong>真相：</strong>过度训练会导致肌肉无法恢复，影响进步甚至导致受伤。休息和恢复同样重要。</p>
              </div>
              <div class="myth-item myth-false">
                <div class="myth-header">
                  <el-icon><Close /></el-icon>
                  <h4>误区二：只练想练的部位</h4>
                </div>
                <p><strong>真相：</strong>全身均衡发展才能避免肌肉不平衡，减少受伤风险。</p>
              </div>
              <div class="myth-item myth-false">
                <div class="myth-header">
                  <el-icon><Close /></el-icon>
                  <h4>误区三：不吃碳水化合物</h4>
                </div>
                <p><strong>真相：</strong>碳水化合物是主要能量来源，合理摄入才能保证训练质量。</p>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h3>给新手的建议</h3>
            <div class="advice-grid">
              <div class="advice-card">
                <div class="advice-icon">
                  <el-icon><Calendar /></el-icon>
                </div>
                <h4>保持耐心</h4>
                <p>健身成果需要时间积累，不要急于求成</p>
              </div>
              <div class="advice-card">
                <div class="advice-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <h4>记录训练</h4>
                <p>记录每次训练内容，便于追踪进步</p>
              </div>
              <div class="advice-card">
                <div class="advice-icon">
                  <el-icon><Headset /></el-icon>
                </div>
                <h4>倾听身体</h4>
                <p>注意身体的信号，避免过度训练</p>
              </div>
              <div class="advice-card">
                <div class="advice-icon">
                  <el-icon><Setting /></el-icon>
                </div>
                <h4>持续学习</h4>
                <p>不断学习健身知识，调整训练计划</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 总结 -->
        <div class="conclusion-section">
          <div class="conclusion-card">
            <h3 class="conclusion-title">
              <el-icon><Finished /></el-icon>
              总结
            </h3>
            <p class="conclusion-text">
              健身是一段充满挑战和收获的旅程。记住，最重要的是坚持下去。
              不要盲目追求完美，而是追求进步。从今天开始，迈出第一步，继续保持，你就会看到自己的改变。
            </p>
            <div class="conclusion-actions">
              <el-button type="primary" @click="scrollToTop">
                回到顶部
                <el-icon><Top /></el-icon>
              </el-button>
              <el-button @click="goToHome">
                返回首页
                <el-icon><Back /></el-icon>
              </el-button>
              <el-button @click="shareGuide">
                分享指南
                <el-icon><Share /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边目录 -->
      <div class="sidebar">
        <div class="sidebar-sticky">
          <h4 class="sidebar-title">快速导航</h4>
          <ul class="sidebar-nav">
            <li
                v-for="(chapter, index) in chapters"
                :key="index"
                :class="{ active: activeChapter === chapter.id }"
            >
              <a
                  :href="'#' + chapter.id"
                  @click.prevent="scrollToChapter(chapter.id)"
              >
                {{ chapter.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 浮动操作按钮 -->
    <div class="floating-actions">
      <el-tooltip content="返回首页" placement="left">
        <el-button circle type="success" size="large" @click="goToHome">
          <el-icon><HomeFilled /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="回到顶部" placement="left">
        <el-button
            circle
            type="primary"
            size="large"
            @click="scrollToTop"
            v-show="showBackToTop"
        >
          <el-icon><Top /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="分享指南" placement="left">
        <el-button circle size="large" @click="shareGuide">
          <el-icon><Share /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Clock, User, Star, ArrowDown, Menu,
  TrendCharts, Odometer, Food, InfoFilled,
  Close, Calendar, Document, Headset, Setting,
  Finished, Top, Share, Back, HomeFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import heroBg from '@/assets/guide/hero-bg.jpg'
import fitnessBase from '@/assets/guide/fitness-base.jpg'
import squat from '@/assets/guide/squat.jpg'
import benchPress from '@/assets/guide/bench-press.jpg'
import deadlift from '@/assets/guide/deadlift.jpg'




// 章节数据
const chapters = ref([
  {
    id: 'chapter1',
    title: '健身基础概念',
    desc: '了解健身的核心要素和基本原理',
    tags: ['入门', '基础', '概念']
  },
  {
    id: 'chapter2',
    title: '训练原则与方法',
    desc: '掌握科学的训练方法和基本原则',
    tags: ['训练', '方法', '原则']
  },
  {
    id: 'chapter3',
    title: '营养与饮食',
    desc: '合理的营养是健身成功的关键',
    tags: ['营养', '饮食', '健康']
  },
  {
    id: 'chapter4',
    title: '常见误区与建议',
    desc: '避开陷阱，科学健身',
    tags: ['误区', '建议', '新手']
  }
])

// 滚动进度
const scrollProgress = ref(0)
const activeChapter = ref('chapter1')
const showBackToTop = ref(false)

// 滚动到指定章节
const scrollToChapter = (chapterId) => {
  const element = document.getElementById(chapterId)
  if (element) {
    const offset = 80
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = element.getBoundingClientRect().top
    const offsetPosition = offset + elementRect - bodyRect

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 分享指南
const shareGuide = () => {
  if (navigator.share) {
    navigator.share({
      title: '健身入门指南',
      text: '从零开始，科学健身，打造健康体魄',
      url: window.location.href
    }).catch((error) => {
      console.log('分享取消', error)
    })
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(window.location.href).then(() => {
      ElMessage.success('链接已复制到剪贴板')
    }).catch(() => {
      ElMessage.warning('复制失败，请手动复制链接')
    })
  }
}

// 返回首页
const goToHome = () => {
  window.location.href = 'http://localhost:3000/'
}

// 处理滚动事件
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

  // 计算进度
  scrollProgress.value = (scrollTop / scrollHeight) * 100

  // 显示/隐藏回到顶部按钮
  showBackToTop.value = scrollTop > 300

  // 更新当前激活的章节
  chapters.value.forEach(chapter => {
    const element = document.getElementById(chapter.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 150 && rect.bottom >= 150) {
        activeChapter.value = chapter.id
      }
    }
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化检查
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fitness-guide-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #c0d2ea 0%, #e2c4c3 100%);
  padding-bottom: 60px;
}

/* 导航栏 */
.guide-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
}

.nav-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.progress-indicator {
  width: 100%;
  height: 3px;
  background: #e0e0e0;
  border-radius: 3px;
  margin-top: 1rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

/* 封面区域 */
.hero-section {
  position: relative;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: 2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.hero-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.start-reading-btn {
  font-size: 1.1rem;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.start-reading-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

/* 目录 */
.table-of-contents {
  background: white;
  padding: 4rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.toc-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.toc-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.toc-card:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.toc-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  opacity: 0.3;
  margin-bottom: 0.5rem;
}

.toc-chapter-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.toc-desc {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.toc-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

/* 文章内容 */
.article-container {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.article-content {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.chapter {
  margin-bottom: 4rem;
  scroll-margin-top: 100px;
}

.chapter-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 3px solid #667eea;
}

.chapter-number {
  display: inline-block;
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  opacity: 0.3;
  margin-bottom: 1rem;
}

.chapter-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.chapter-subtitle {
  font-size: 1.2rem;
  color: #666;
}

.content-block {
  margin-bottom: 2rem;
}

.content-block h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

.content-block p {
  line-height: 1.8;
  color: #444;
  margin-bottom: 1rem;
}

.image-card {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.image-card img {
  width: 100%;
  height: auto;
  display: block;
}

.image-caption {
  background: #f8f9fa;
  padding: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.feature-card h4 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #666;
  font-size: 0.9rem;
}

.tip-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid #2196f3;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #1976d2;
  margin-bottom: 1rem;
  font-weight: bold;
}

.comparison-table {
  overflow-x: auto;
  margin: 2rem 0;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.comparison-table th {
  background: #667eea;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: bold;
}

.comparison-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  color: #444;
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

.comparison-table tr:nth-child(even) {
  background: #f8f9fa;
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.exercise-item {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.exercise-image {
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
}

.exercise-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exercise-info h4 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.exercise-info p {
  color: #666;
  margin-bottom: 0.25rem;
}

.nutrition-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.nutrition-card {
  padding: 2rem;
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
  width: 100%;
}

.nutrition-card:hover {
  transform: translateY(5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.nutrition-card.protein {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
}

.nutrition-card.carb {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
}

.nutrition-card.fat {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.nutrition-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.nutrition-header h4 {
  font-size: 1.5rem;
  font-weight: bold;
}

.nutrition-card p {
  margin-bottom: 0.5rem;
  opacity: 0.95;
}

.timeline {
  margin-top: 2rem;
}

.timeline-item {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-time {
  flex-shrink: 0;
  width: 150px;
  background: #667eea;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.timeline-content {
  flex: 1;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.timeline-content h5 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.timeline-content p {
  color: #666;
}

.myth-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.myth-item {
  background: #fff3cd;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #ffc107;
}

.myth-item.myth-false {
  background: #f8d7da;
  border-left-color: #dc3545;
}

.myth-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.myth-header h4 {
  font-size: 1.3rem;
  color: #333;
}

.myth-item p {
  color: #666;
  line-height: 1.6;
}

.advice-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.advice-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.advice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.advice-icon {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.advice-card h4 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.advice-card p {
  color: #666;
  font-size: 0.9rem;
}

.conclusion-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 3px solid #667eea;
}

.conclusion-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  color: white;
}

.conclusion-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.conclusion-text {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.conclusion-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.conclusion-actions .el-button {
  border: none;
}

/* 侧边栏 */
.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-sticky {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 0.75rem;
}

.sidebar-nav a {
  display: block;
  padding: 0.75rem 1rem;
  color: #666;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.sidebar-nav a:hover {
  background: #f8f9fa;
  color: #667eea;
}

.sidebar-nav li.active a {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.sidebar-tips {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.sidebar-tips h5 {
  font-size: 1.1rem;
  color: #856404;
  margin-bottom: 0.5rem;
}

.sidebar-tips p {
  font-size: 0.9rem;
  color: #856404;
}

/* 浮动按钮 */
.floating-actions {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
}

.floating-actions .el-button {
  width: 56px;
  height: 56px;
  font-size: 1.3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.floating-actions .el-button:hover {
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 968px) {
  .article-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .nav-links {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .advice-grid {
    grid-template-columns: 1fr;
  }

  .nutrition-card {
    padding: 1.5rem;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .toc-grid {
    grid-template-columns: 1fr;
  }

  .article-content {
    padding: 2rem 1.5rem;
  }

  .chapter-title {
    font-size: 2rem;
  }

  .exercise-item {
    flex-direction: column;
  }

  .exercise-image {
    width: 100%;
  }
}
</style>
