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
          <SelectTrigger className="w-full dark:bg-background-dark border-primary border dark:border-primary-dark dark:text-secondary-dark">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent className="bg-background dark:bg-background-dark">
            {companies.map((company, index) => (
              <SelectItem
                key={index}
                value={index.toString()}
                className=" 
                hover:text-primary-dark hover:bg-secondary :hover:font-semibold
                dark:hover:text-primary dark:hover:bg-secondary-dark
                data-[state=checked]:bg-primary data-[state=checked]:text-foreground-dark
                dark:data-[state=checked]:bg-primary-dark dark:data-[state=checked]:text-slate-800  
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
                  ? 'bg-transparent border-primary border-l-2 dark:border-l-primary-dark dark:text-secondary-dark font-semibold'
                  : 'hover:bg-transparent hover:text-background dark:hover:text-primary-dark hover:border-secondary hover:dark:border-l-secondary-dark'
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
