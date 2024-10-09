import { FC, memo, ReactNode, useState } from 'react';
import s from './Section.module.scss';
import { animated, useSpring } from 'react-spring';
import useMeasure from 'react-use-measure';
import { CircleMinus, CirclePlus } from 'lucide-react';

interface ISectionProps {
  title: string;
  children: ReactNode;
  fixed?: boolean;
  className?: string;
}

const SectionComponent: FC<ISectionProps> = ({
  title,
  children,
  fixed,
  className,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [ref, { height }] = useMeasure();

  const toggleMinimize = () => {
    if (fixed) return;
    setIsMinimized(!isMinimized);
  };

  const expandAnimation = useSpring({
    maxHeight: isMinimized ? `${height}px` : `100%`,
    opacity: isMinimized ? 0 : 1,
    config: {
      duration: 200,
    },
  });

  return (
    <animated.div
      style={{ maxHeight: expandAnimation.maxHeight }}
      className={`${className} ${s.section}`}
    >
      <section className={s.titleBar} ref={ref}>
        <h5 className={s.title}>{title}</h5>
        {!fixed && (
          <button className={s.toggleButton} onClick={toggleMinimize}>
            {isMinimized ? (
              <CirclePlus color={'white'} size={16} />
            ) : (
              <CircleMinus color={'white'} size={16} />
            )}
          </button>
        )}
      </section>
      <animated.section
        style={{ opacity: expandAnimation.opacity }}
        className={s.content}
      >
        {children}
      </animated.section>
    </animated.div>
  );
};

export default memo(SectionComponent);
