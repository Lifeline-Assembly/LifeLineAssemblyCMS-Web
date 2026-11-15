interface InputProps {
  label: string;
  type?: 'email' | 'password' | 'text' | 'number' | 'date';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: unknown) => void
  name?: string
  id?: string
  error?: string
}

const RegularTextArea: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  id,
  name,
  error
}) => {

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between">
        <label className="font-normal text-base text-[#383838] ">{label}</label>
      </div>
      <div className="relative">
        <textarea
          rows={5}
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          id={id}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          className="appearance-none w-full p-3 placeholder:text-[#7A7A7A] rounded-[5px] border-[1px] border-[#EAECF0] focus:outline-none focus:ring-2 focus:ring-main-orange"
        />
      </div>
      <p className="text-[12px] text-red-500">{error}</p>
    </div>
  );
};

export default RegularTextArea;
