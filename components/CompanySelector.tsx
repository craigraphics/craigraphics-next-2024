import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Company {
  title: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
}

interface CompanySelectorProps {
  companies: Company[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ companies, activeTab, setActiveTab }) => {
  const handleSelectChange = (value: string) => {
    setActiveTab(Number(value));
  };

  return (
    <div>
      {/* Mobile view */}
      <div className="sm:hidden w-full">
        <Select onValueChange={handleSelectChange} value={activeTab.toString()}>
          <SelectTrigger className="w-full bg-background border-primary border">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {companies.map((company, index) => (
              <SelectItem
                key={index}
                value={index.toString()}
                className="
                hover:text-primary hover:bg-secondary hover:font-semibold
                data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
                cursor-pointer"
              >
                {company.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:block">
        {companies.map((company, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`w-full text-left py-2 px-4 mb-2 font-medium transition border-l-2 border-transparent
              ${
                activeTab === index
                  ? 'bg-transparent border-primary border-l-2 text-secondary font-semibold'
                  : 'hover:bg-transparent hover:text-primary hover:border-secondary'
              }`}
          >
            {company.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompanySelector;
