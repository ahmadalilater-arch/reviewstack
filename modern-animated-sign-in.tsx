import {
  memo,
  ReactNode,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==================== Input Component ====================
// Framer Motion radial gradient that follows mouse cursor

const Input = memo(
  forwardRef(function Input(
    { className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) {
    const radius = 120;
    const [visible, setVisible] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
      currentTarget,
      clientX,
      clientY,
    }: React.MouseEvent<HTMLDivElement>) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
              rgba(139,92,246,0.7),
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-xl p-[1.5px] transition duration-300"
      >
        <input
          type={type}
          className={cn(
            `flex h-12 w-full rounded-[10px] border-none bg-zinc-900/90 px-4 py-2 text-sm text-white
             transition duration-300 placeholder:text-zinc-600
             focus-visible:ring-[2px] focus-visible:ring-sky-500/40 focus-visible:outline-none
             disabled:cursor-not-allowed disabled:opacity-50
             shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]
             hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]`,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  })
);
Input.displayName = 'Input';

// ==================== BoxReveal Component ====================
// Slides up from y:75 with a colored block wiping left→right

export type BoxRevealProps = {
  children: ReactNode;
  width?: string;
  boxColor?: string;
  duration?: number;
  overflow?: string;
  position?: string;
  className?: string;
  delay?: number;
};

export const BoxReveal = memo(function BoxReveal({
  children,
  width = 'fit-content',
  boxColor = '#7c3aed',
  duration = 0.45,
  overflow = 'hidden',
  position = 'relative',
  className,
  delay = 0,
}: BoxRevealProps) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start('visible');
      mainControls.start('visible');
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <section
      ref={ref}
      style={{
        position: position as 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static',
        width,
        overflow,
      }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay: 0.2 + delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
      {/* The wipe-across block */}
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: '100%' } }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration, ease: 'easeIn', delay }}
        style={{
          position: 'absolute',
          top: 2,
          bottom: 2,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor,
          borderRadius: 4,
        }}
      />
    </section>
  );
});

// ==================== Ripple Component ====================
// Concentric pulsing circles radiating from center

export type RippleProps = {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
};

export const Ripple = memo(function Ripple({
  mainCircleSize = 140,
  mainCircleOpacity = 0.18,
  numCircles = 9,
  className = '',
}: RippleProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden',
        className
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 80;
        const opacity = Math.max(mainCircleOpacity - i * 0.018, 0);
        const animationDelay = `${i * 0.15}s`;
        const borderStyle = i === numCircles - 1 ? 'dashed' : 'solid';

        return (
          <span
            key={i}
            className="absolute animate-ripple rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDelay,
              borderStyle,
              borderWidth: '1px',
              borderColor: `rgba(139,92,246,${0.15 + i * 0.01})`,
              background: `radial-gradient(ellipse at center, rgba(109,40,217,${opacity * 0.25}) 0%, transparent 70%)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
});

// ==================== OrbitingCircles Component ====================

export type OrbitingCirclesProps = {
  className?: string;
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
};

export const OrbitingCircles = memo(function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-white/[0.05]"
            strokeWidth="1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      <div
        style={
          {
            '--duration': duration,
            '--radius': radius,
            '--delay': -delay,
          } as React.CSSProperties
        }
        className={cn(
          'absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full',
          '[animation-delay:calc(var(--delay)*1000ms)]',
          reverse && '[animation-direction:reverse]',
          className
        )}
      >
        {children}
      </div>
    </>
  );
});

// ==================== TechOrbitDisplay Component ====================

export type IconConfig = {
  className?: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
  component: () => React.ReactElement;
};

export type TechOrbitDisplayProps = {
  iconsArray: IconConfig[];
  centerContent?: ReactNode;
  text?: string;
};

export const TechOrbitDisplay = memo(function TechOrbitDisplay({
  iconsArray,
  centerContent,
  text,
}: TechOrbitDisplayProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {centerContent ?? (
          <span className="pointer-events-none bg-gradient-to-b from-white to-white/20 bg-clip-text text-center text-6xl font-bold leading-none text-transparent">
            {text ?? ''}
          </span>
        )}
      </div>

      {iconsArray.map((icon, index) => (
        <OrbitingCircles
          key={index}
          className={icon.className}
          duration={icon.duration}
          delay={icon.delay}
          radius={icon.radius}
          path={icon.path}
          reverse={icon.reverse}
        >
          {icon.component()}
        </OrbitingCircles>
      ))}
    </div>
  );
});

// ==================== BottomGradient ====================

export const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
  </>
);

// ==================== Label Component ====================

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

export const Label = memo(function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 leading-none',
        className
      )}
      {...props}
    />
  );
});

// ==================== AnimatedForm Component ====================

type FieldType = 'text' | 'email' | 'password';

export type Field = {
  label: string;
  required?: boolean;
  type: FieldType;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type AnimatedFormProps = {
  header: string;
  subHeader?: string;
  fields: Field[];
  submitButton: string;
  textVariantButton?: string;
  altActionLabel?: string;
  altActionButton?: string;
  errorField?: string;
  fieldPerRow?: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  googleLogin?: string;
  goTo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onAltAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
};

type Errors = { [key: string]: string };

export const AnimatedForm = memo(function AnimatedForm({
  header,
  subHeader,
  fields,
  submitButton,
  textVariantButton,
  altActionLabel,
  altActionButton,
  errorField,
  fieldPerRow = 1,
  onSubmit,
  googleLogin,
  goTo,
  onAltAction,
  isLoading,
}: AnimatedFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    const currentErrors: Errors = {};
    fields.forEach((field) => {
      const value = (event.target as HTMLFormElement)[field.label]?.value;
      if (field.required && !value)
        currentErrors[field.label] = `${field.label} is required`;
      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value))
        currentErrors[field.label] = 'Invalid email address';
      if (field.type === 'password' && value && value.length < 6)
        currentErrors[field.label] = 'Password must be at least 6 characters';
    });
    return currentErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formErrors = validateForm(event);
    if (Object.keys(formErrors).length === 0) {
      setErrors({});
      onSubmit(event);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">

      {/* ── Header — BoxReveal wipe ── */}
      <BoxReveal boxColor="#6d28d9" duration={0.5} overflow="visible" width="100%" delay={0}>
        <div>
          <h2 className="font-black text-[2rem] text-white tracking-tight leading-[1.1]">
            {header}
          </h2>
          {subHeader && (
            <p className="text-zinc-500 text-sm mt-2.5 leading-relaxed">{subHeader}</p>
          )}
        </div>
      </BoxReveal>

      {/* ── Google button ── */}
      {googleLogin && (
        <>
          <BoxReveal boxColor="#6d28d9" duration={0.4} overflow="visible" width="100%" delay={0.05}>
            <button
              type="button"
              className="group/btn relative w-full rounded-xl border border-white/[0.07] bg-white/[0.02]
                hover:bg-white/[0.05] h-12 font-medium text-sm text-zinc-300 transition-all
                duration-200 flex items-center justify-center gap-3 overflow-hidden"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLogin}
              <BottomGradient />
            </button>
          </BoxReveal>

          <BoxReveal boxColor="#6d28d9" duration={0.35} width="100%" delay={0.08}>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-zinc-700 text-xs font-medium tracking-wider uppercase">or</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>
          </BoxReveal>
        </>
      )}

      {/* ── Fields ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div
          className={cn(
            'gap-4',
            fieldPerRow === 2
              ? 'grid grid-cols-2'
              : 'flex flex-col'
          )}
        >
          {fields.map((field, fi) => (
            <div key={field.label} className="flex flex-col gap-2">
              {/* Label — BoxReveal */}
              <BoxReveal
                boxColor="#6d28d9"
                duration={0.3}
                overflow="visible"
                width="100%"
                delay={0.1 + fi * 0.04}
              >
                <Label htmlFor={field.label}>
                  {field.label}
                  {field.required && <span className="text-sky-500 ml-0.5">*</span>}
                </Label>
              </BoxReveal>

              {/* Input — BoxReveal */}
              <BoxReveal
                boxColor="#6d28d9"
                duration={0.35}
                overflow="visible"
                width="100%"
                delay={0.13 + fi * 0.04}
              >
                <div className="relative">
                  <Input
                    type={
                      field.type === 'password'
                        ? showPassword ? 'text' : 'password'
                        : field.type
                    }
                    id={field.label}
                    name={field.label}
                    placeholder={field.placeholder}
                    onChange={field.onChange}
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-zinc-600 hover:text-zinc-300 transition-colors z-10"
                    >
                      {showPassword
                        ? <Eye className="h-4 w-4" />
                        : <EyeOff className="h-4 w-4" />
                      }
                    </button>
                  )}
                </div>
                {errors[field.label] && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                    {errors[field.label]}
                  </motion.p>
                )}
              </BoxReveal>
            </div>
          ))}
        </div>

        {/* Global error */}
        {errorField && (
          <p className="text-red-400 text-sm">{errorField}</p>
        )}

        {/* Forgot password link */}
        {textVariantButton && goTo && (
          <BoxReveal boxColor="#6d28d9" duration={0.3} overflow="visible" width="100%" delay={0.25}>
            <div className="text-right -mt-2">
              <button
                type="button"
                className="text-xs text-zinc-600 hover:text-sky-400 font-medium transition-colors"
                onClick={goTo}
              >
                {textVariantButton}
              </button>
            </div>
          </BoxReveal>
        )}

        {/* Submit button */}
        <BoxReveal boxColor="#6d28d9" duration={0.4} overflow="visible" width="100%" delay={0.28}>
          <button
            type="submit"
            disabled={isLoading}
            className="group/btn relative w-full rounded-xl overflow-hidden
              bg-gradient-to-br from-sky-600 via-sky-600 to-sky-600
              text-white h-12 font-bold text-sm
              hover:shadow-[0_0_50px_rgba(139,92,246,0.45)]
              hover:scale-[1.015] active:scale-[0.99]
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
              shadow-[0_0_24px_rgba(139,92,246,0.25)]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      delay: i * 0.12,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            ) : (
              <span className="relative z-10">{submitButton} →</span>
            )}
            {/* Shimmer sweep */}
            <div
              className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent
                translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"
            />
            <BottomGradient />
          </button>
        </BoxReveal>

        {/* Alt action (switch mode) */}
        {altActionLabel && altActionButton && onAltAction && (
          <BoxReveal boxColor="#6d28d9" duration={0.3} overflow="visible" width="100%" delay={0.32}>
            <div className="text-center">
              <span className="text-zinc-600 text-sm">{altActionLabel} </span>
              <button
                type="button"
                onClick={onAltAction}
                className="text-sky-400 hover:text-sky-300 text-sm font-bold transition-colors"
              >
                {altActionButton}
              </button>
            </div>
          </BoxReveal>
        )}
      </form>
    </div>
  );
});

// ==================== Exports ====================
export { Input };
