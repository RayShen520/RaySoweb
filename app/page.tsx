'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const PRODUCTS = [
  {
    title: '智能眼镜',
    description: 'AI+AR 可穿戴设备，支持实时翻译、导航、记忆辅助与 vlog 录制。',
    icon: 'https://via.placeholder.com/60',
    alt: '眼镜图标'
  },
  {
    title: '智能办公助手',
    description: '自动整理日程、生成文档摘要、语音识别与会议记录，提高工作效率。',
    icon: 'https://via.placeholder.com/60',
    alt: '办公图标'
  },
  {
    title: '语言学习应用',
    description: '基于 AI 的口语练习、单词记忆与语法纠错，帮助学习者快速提升交流能力。',
    icon: 'https://via.placeholder.com/60',
    alt: '学习图标'
  }
];

const TEAM = [
  { name: '张三', role: 'CEO & 创始人', avatar: 'https://via.placeholder.com/120', alt: 'CEO' },
  { name: '李四', role: 'CTO & 技术总监', avatar: 'https://via.placeholder.com/120', alt: 'CTO' },
  { name: '王五', role: 'CMO & 市场总监', avatar: 'https://via.placeholder.com/120', alt: 'CMO' }
];

const CASES = [
  {
    title: '某科技企业',
    description: '使用 RaySo AI 智能办公助手，实现团队效率提升 40%。',
    image: 'https://via.placeholder.com/300x180',
    alt: '客户1'
  },
  {
    title: '教育培训机构',
    description: '引入 AI+AR 智能眼镜，提高学生语言学习互动体验。',
    image: 'https://via.placeholder.com/300x180',
    alt: '客户2'
  },
  {
    title: '跨境电商平台',
    description: '使用智能翻译与数据分析工具，实现海外市场拓展。',
    image: 'https://via.placeholder.com/300x180',
    alt: '客户3'
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
            <a href="#team">团队</a>
          </li>
          <li>
            <a href="#cases">案例</a>
          </li>
          <li>
            <a href="#interactive">互动</a>
          </li>
          <li>
            <a href="#contact">联系我们</a>
          </li>
        </ul>
      </nav>

      <section className="hero">
        <canvas id="particles-canvas" ref={particlesRef}></canvas>
        <h1 className="fade-target">智能科技，引领未来</h1>
        <p className="fade-target">
          RaySo AI 专注人工智能解决方案，提供智能办公、语言学习、AI+AR 智能眼镜等创新产品，让生活与工作更高效、更智能。
        </p>
        <button onClick={handleScrollToContact}>立即联系</button>
      </section>

      <section id="products" className="container">
        <h2 className="fade-target" style={{ textAlign: 'center', color: '#4f46e5' }}>
          我们的产品
        </h2>
        <div className="products">
          {PRODUCTS.map((product) => (
            <div key={product.title} className="product-card fade-target">
              <img className="icon" src={product.icon} alt={product.alt} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="team" className="container">
        <h2 className="fade-target" style={{ textAlign: 'center', color: '#4f46e5' }}>
          核心团队
        </h2>
        <div className="team">
          {TEAM.map((member) => (
            <div key={member.name} className="member-card fade-target">
              <div className="circle-bg"></div>
              <img src={member.avatar} alt={member.alt} />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cases" className="container">
        <h2 className="fade-target" style={{ textAlign: 'center', color: '#4f46e5' }}>
          客户案例
        </h2>
        <div className="carousel fade-target">
          <button className="prev" onClick={handlePrev} aria-label="上一条案例">
            &#10094;
          </button>
          <div className="carousel-track" ref={carouselTrackRef} style={carouselStyle}>
            {CASES.map((item) => (
              <div key={item.title} className="case-card fade-target">
                <img src={item.image} alt={item.alt} />
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

      <section id="interactive" className="container">
        <h2 className="fade-target" style={{ textAlign: 'center', color: '#4f46e5' }}>
          AI+AR 智能眼镜互动展示
        </h2>
        <div className="interactive-demo fade-target">
          <div id="three-container" ref={threeContainerRef}></div>
        </div>
      </section>

      <section id="contact" className="contact container fade-target">
        <h2 style={{ textAlign: 'center', color: '#4f46e5' }}>联系我们</h2>
        <form action="https://formspree.io/f/yourformid" method="POST" className="fade-target">
          <input type="text" name="name" placeholder="姓名" required />
          <input type="email" name="email" placeholder="邮箱" required />
          <textarea name="message" placeholder="留言" required></textarea>
          <button type="submit">发送消息</button>
        </form>
      </section>

      <footer>&copy; {new Date().getFullYear()} RaySo AI. 保留所有权利。</footer>
    </main>
  );
}

