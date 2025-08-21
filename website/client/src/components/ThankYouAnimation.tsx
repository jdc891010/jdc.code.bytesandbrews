interface ThankYouAnimationProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const ThankYouAnimation = ({ open, message, onClose }: ThankYouAnimationProps) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center relative">
        <h3 className="text-2xl font-bold text-coffee-brown mb-4">Thank You!</h3>
        <p className="mb-6">{message}</p>
        
        <div className="flex justify-center mb-4">
          {/* High five and fist bump SVG animation */}
          <svg width="160" height="100" viewBox="0 0 160 100">
            <g className="high-five">
              <path d="M40,80 C30,75 25,65 25,50 C25,40 30,35 35,35 C40,35 45,40 45,50 C45,60 42,70 40,80 Z" fill="#f8d7c9" />
              <path d="M40,40 L40,60 L45,63 L50,60 L50,40 L45,37 Z" fill="#f8d7c9" />
              <path d="M50,40 L50,60 L55,63 L60,60 L60,40 L55,37 Z" fill="#f8d7c9" />
              <path d="M60,40 L60,60 L65,63 L70,60 L70,40 L65,37 Z" fill="#f8d7c9" />
              <path d="M70,40 L70,60 L75,63 L80,60 L80,40 L75,37 Z" fill="#f8d7c9" />
              <path d="M80,80 C90,75 95,65 95,50 C95,40 90,35 85,35 C80,35 75,40 75,50 C75,60 78,70 80,80 Z" fill="#f8d7c9" />
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="30 0"
                dur="0.5s"
                begin="0s"
                fill="freeze"
              />
            </g>
            
            <g className="fist-bump">
              <path d="M120,60 C125,55 130,50 130,40 C130,30 125,25 120,25 C115,25 110,30 110,40 C110,50 115,55 120,60 Z" fill="#f8d7c9" />
              <path d="M100,50 C95,45 90,40 90,30 C90,20 95,15 100,15 C105,15 110,20 110,30 C110,40 105,45 100,50 Z" fill="#f8d7c9" />
              <rect x="100" y="40" width="20" height="20" rx="10" fill="#f8d7c9" />
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="-30 0"
                dur="0.5s"
                begin="0s"
                fill="freeze"
              />
            </g>
            
            {/* Impact starburst */}
            <g opacity="0">
              <path d="M80,50 L85,40 L90,50 L100,45 L95,55 L105,60 L95,65 L100,75 L90,70 L85,80 L80,70 L70,75 L75,65 L65,60 L75,55 L70,45 Z" fill="#FFD700" />
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                dur="0.1s"
                begin="0.5s"
                fill="freeze"
              />
              <animate
                attributeName="opacity"
                from="1"
                to="0"
                dur="0.5s"
                begin="0.7s"
                fill="freeze"
              />
            </g>
          </svg>
        </div>
        
        <p className="text-sm text-gray-500">Closing automatically...</p>
      </div>
    </div>
  );
};

export default ThankYouAnimation;