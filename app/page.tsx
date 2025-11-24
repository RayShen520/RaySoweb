'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const HERO_HIGHLIGHTS = [
  { title: '全栈方案', description: 'AI + AR + IoT 一体化部署' },
  { title: '行业数据湖', description: '7×24 小时实时同步 12 TB 数据' },
  { title: '安全合规', description: 'ISO/IEC 27001 & GDPR 双认证' }
];

const PRODUCTS = [
  {
    title: 'AI+AR 智能眼镜',
    description: '自研算法支持场景识别、实时翻译、多人协作，满足外勤/培训/零售场景。',
    icon: '/images/product-glasses.svg',
    alt: '智能眼镜'
  },
  {
    title: '智能办公助手',
    description: '自动会议纪要、多语音指令、知识库检索，提升企业知识沉淀效率 3 倍。',
    icon: '/images/product-office.svg',
    alt: '办公助手'
  },
  {
    title: 'AI 语言学习平台',
    description: '沉浸式口语、实时纠错与个性化学习路径，服务 60+ 所院校。',
    icon: '/images/product-education.svg',
    alt: '语言学习'
  }
];

const FEATURES = [
  {
    tag: '实时感知',
    title: '多模态传感数据融合',
    description: '整合语音、视觉、文本信号，毫秒级触发联动策略。',
    bullets: ['语音识别延迟 < 300ms', '自适应噪音模型', '离线 fallback 机制']
  },
  {
    tag: '智能决策',
    title: '企业级知识推理引擎',
    description: '基于矢量知识库与链路追踪算法，保障输出可溯源、可解释。',
    bullets: ['多轮对话记忆', '行业词典热更新', 'Top-k 证据回溯']
  },
  {
    tag: '运维洞察',
    title: '可视化运营驾驶舱',
    description: '统一指标面板，支持跨区域集群/终端的健康度监测与治理。',
    bullets: ['异常分布预警', '灰度发布管理', 'SLA 自动化汇报']
  }
];

const STATS = [
  { label: '企业客户', value: '120+', detail: '覆盖 12 个行业' },
  { label: '上线终端', value: '48,000', detail: '全球 42 城运行' },
  { label: '模型更新', value: '72h', detail: '自动安全审核' },
  { label: '满意度', value: '98%', detail: 'NPS 67 分' }
];

const GALLERY = [
  { title: '智能指挥中心', caption: '多设备协同可视化调度', image: '/images/gallery-1.svg' },
  { title: 'AI 教学空间', caption: '实时纠错+课堂互动', image: '/images/gallery-2.svg' },
  { title: '数据分析战情室', caption: '关键指标一屏掌控', image: '/images/gallery-3.svg' }
];

const TEAM = [
  { name: '张之衡', role: '创始人 & CEO', avatar: '/images/team-1.svg', alt: 'CEO' },
  { name: '李蓓', role: 'CTO & 算法负责人', avatar: '/images/team-2.svg', alt: 'CTO' },
  { name: '王彦', role: 'CSO & 商业拓展', avatar: '/images/team-3.svg', alt: 'CSO' }
];

const CASES = [
  {
    title: '先锋制造集团',
    description: '智能眼镜辅助质检，缺陷识别准确率提升 35%。',
    image: '/images/gallery-1.svg',
    alt: '制造场景'
  },
  {
    title: '光谱教育',
    description: '校园 AI 学习平台上线 3 周覆盖 5 万学生。',
    image: '/images/gallery-2.svg',
    alt: '教育场景'
  },
  {
    title: '合纵跨境',
    description: '多语种客服机器人助力 GMV 月增 22%。',
    image: '/images/gallery-3.svg',
    alt: '电商场景'
  }
];

const TIMELINE = [
  { step: '01', title: '咨询诊断', detail: '与决策层/业务团队梳理场景痛点与指标。' },
  { step: '02', title: '方案定制', detail: '输出架构蓝图、算力规划与项目排期。' },
  { step: '03', title: '联合交付', detail: 'PoC→试点→全量，配套培训与运维手册。' },
  { step: '04', title: '持续优化', detail: '模型回传、数据洞察、业务增长共创。' }
];

const TESTIMONIALS = [
  {
    name: '刘晨',
    title: '星瀚能源 CIO',
    quote: 'RaySo AI 的知识引擎让我们维修工单的处理率提升到 92%，跨区域协同效率显著提升。',
    avatar: '/images/testimonial-1.svg'
  },
  {
    name: 'Emily Zhou',
    title: 'GlobalEd 运营副总裁',
    quote: '他们的多模态学习平台，让教师和学习者都能实时看到进度与反馈，满意度飙升。',
    avatar: '/images/testimonial-2.svg'
  }
];

const FAQS = [
  {
    question: '部署周期通常多长？',
    answer: '标准版 4-6 周上线，自定义大项目取决于硬件集成与数据治理复杂度。'
  },
  {
    question: '如何保障数据安全？',
    answer: '全链路加密、私有化部署、零信任访问控制，并通过 ISO 27001 及等保二级。'
  },
  {
    question: '是否支持混合云或离线场景？',
    answer: '支持本地集群、边缘盒子以及主流云厂商，离线模式可自动同步。'
  }
];
export default function HomePage() {
  const particlesRef = useRef<HTMLCanvasElement | null>(null);
  const threeContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const caseCount = CASES.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.fade-target');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2
    }));

    let animationFrameId: number;
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        particle.y -= particle.speed;
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }
      });
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const container = threeContainerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(ambient, dirLight);

    const loader = new GLTFLoader();
    loader.load('https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(2, 2, 2);
      scene.add(model);
    });

    let frameId: number;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (!track) {
      return;
    }

    const updateWidth = () => {
      const firstCard = track.querySelector<HTMLElement>('.case-card');
      if (firstCard) {
        const gap = 20;
        setCardWidth(firstCard.offsetWidth + gap);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const carouselStyle = useMemo(() => {
    return { transform: `translateX(-${carouselIndex * cardWidth}px)` };
  }, [carouselIndex, cardWidth]);

  const handleNext = () => setCarouselIndex((prev) => (prev + 1) % caseCount);
  const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + caseCount) % caseCount);

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <nav className="fade-target visible">
        <div className="logo">RaySo AI</div>
        <ul>
          <li>
            <a href="#products">产品</a>
          </li>
          <li>
            <a href="#features">能力</a>
          </li>
          <li>
            <a href="#cases">案例</a>
          </li>
          <li>
            <a href="#gallery">展示</a>
          </li>
          <li>
            <a href="#interactive">互动</a>
          </li>
          <li>
            <a href="#contact">联系</a>
          </li>
        </ul>
      </nav>

      <section className="hero">
        <canvas id="particles-canvas" ref={particlesRef}></canvas>
        <div className="hero-inner container">
          <div className="hero-content fade-target">
            <p className="hero-label">新一代企业级 AI 体验平台</p>
            <h1>把 AI 能力植入每一次业务决策与用户体验</h1>
            <p>
              我们将 AI+AR+数据智能融为统一体验，从可穿戴终端、智能办公到行业教学，让每一位成员都能实时连接知识、洞察和创意。
            </p>
            <div className="hero-cta">
              <button onClick={handleScrollToContact}>预约演示</button>
              <button className="ghost" onClick={() => window.open('https://www.netlify.com', '_blank')}>
                下载白皮书
              </button>
            </div>
            <ul className="hero-highlights">
              {HERO_HIGHLIGHTS.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-visual fade-target">
            <Image src="/images/hero-visual.svg" alt="RaySo AI 体验平台" width={560} height={420} priority />
          </div>
        </div>
      </section>

      <section className="container stats-section fade-target" aria-label="数据概览">
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="container">
        <div className="section-head fade-target">
          <p className="eyebrow">产品矩阵</p>
          <h2>覆盖穿戴、办公、学习的全链路智能体验</h2>
        </div>
        <div className="products">
          {PRODUCTS.map((product) => (
            <div key={product.title} className="product-card fade-target">
              <Image className="icon" src={product.icon} alt={product.alt} width={120} height={80} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="container">
        <div className="section-head fade-target">
          <p className="eyebrow">平台能力</p>
          <h2>从数据到底层算力，打造可落地的智能中枢</h2>
        </div>
        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="feature-card fade-target">
              <span className="feature-tag">{feature.tag}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul>
                {feature.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="team" className="container">
        <div className="section-head fade-target">
          <p className="eyebrow">核心团队</p>
          <h2>来自顶尖 AI 公司与行业龙头的多元组合</h2>
        </div>
        <div className="team">
          {TEAM.map((member) => (
            <div key={member.name} className="member-card fade-target">
              <div className="circle-bg"></div>
              <Image src={member.avatar} alt={member.alt} width={120} height={120} />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cases" className="container">
        <div className="section-head fade-target">
          <p className="eyebrow">客户案例</p>
          <h2>跨行业落地的成功实践</h2>
        </div>
        <div className="carousel fade-target">
          <button className="prev" onClick={handlePrev} aria-label="上一条案例">
            &#10094;
          </button>
          <div className="carousel-track" ref={carouselTrackRef} style={carouselStyle}>
            {CASES.map((item) => (
              <div key={item.title} className="case-card fade-target">
                <Image src={item.image} alt={item.alt} width={320} height={200} />
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <button className="next" onClick={handleNext} aria-label="下一条案例">
            &#10095;
          </button>
        </div>
      </section>

      <section id="gallery" className="container">
        <div className="section-head fade-target">
          <p className="eyebrow">沉浸式体验</p>
          <h2>多场景可视化指挥与演示中心</h2>
        </div>
        <div className="gallery-grid">
          {GALLERY.map((item) => (
            <figure key={item.title} className="gallery-card fade-target">
              <Image src={item.image} alt={item.title} width={380} height={260} />
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="interactive" className="container">
        <div className="section-head fade-target">
          <p className="eyebrow">互动体验</p>
          <h2>AI+AR 智能眼镜实时 3D 演示</h2>
        </div>
        <div className="interactive-demo fade-target">
          <div id="three-container" ref={threeContainerRef}></div>
        </div>
      </section>

      <section id="process" className="container timeline-section">
        <div className="section-head fade-target">
          <p className="eyebrow">合作流程</p>
          <h2>以结果为导向的交付方法论</h2>
        </div>
        <ol className="timeline">
          {TIMELINE.map((stage) => (
            <li key={stage.step} className="fade-target">
              <span>{stage.step}</span>
              <div>
                <h3>{stage.title}</h3>
                <p>{stage.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="testimonials" className="container testimonials">
        <div className="section-head fade-target">
          <p className="eyebrow">客户声音</p>
          <h2>真实的业务价值反馈</h2>
        </div>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((item) => (
            <article key={item.name} className="testimonial-card fade-target">
              <Image src={item.avatar} alt={item.name} width={80} height={80} />
              <p>“{item.quote}”</p>
              <h4>{item.name}</h4>
              <span>{item.title}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="container faq">
        <div className="section-head fade-target">
          <p className="eyebrow">FAQ</p>
          <h2>常见问题</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((faq) => (
            <details key={faq.question} className="fade-target">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta container fade-target">
        <h2>和 RaySo AI 一起重构下一代智能体验</h2>
        <p>留下您的需求，获取行业白皮书、方案 Demo 与技术顾问 1v1 诊断。</p>
        <div className="cta-actions">
          <button onClick={handleScrollToContact}>预约顾问</button>
          <a className="ghost" href="mailto:hello@rayso.ai">
            发送邮件
          </a>
        </div>
      </section>

      <section id="contact" className="contact container fade-target">
        <h2>联系我们</h2>
        <form action="https://formspree.io/f/yourformid" method="POST" className="fade-target">
          <div className="form-grid">
            <input type="text" name="name" placeholder="姓名" required />
            <input type="email" name="email" placeholder="邮箱" required />
            <input type="text" name="company" placeholder="公司 / 机构" required />
            <input type="tel" name="phone" placeholder="手机号（选填）" />
          </div>
          <textarea name="message" placeholder="请描述您的需求或项目背景" required></textarea>
          <button type="submit">发送消息</button>
        </form>
      </section>

      <footer>&copy; {new Date().getFullYear()} RaySo AI · 智能体验实验室</footer>
    </main>
  );
}

