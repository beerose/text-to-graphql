interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}
export default function TextInput(props: TextInputProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="min-w-0 flex-1 ">
        <label
          htmlFor="comment"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 ml-0.5"
        >
          {props.label}
        </label>
        <form action="#" className="relative">
          <div className="overflow-hidden bg-white dark:bg-slate-800 rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-900 focus-within:ring-2 focus-within:ring-indigo-600">
            <textarea
              value={props.value}
              onChange={(e) => props.onChange(e.target.value)}
              rows={7}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder={props.placeholder}
              defaultValue={""}
            />

            {/* <div className="py-2" aria-hidden="true">
              <div className="py-px">
                <div className="h-4" />
              </div>
            </div> */}
          </div>

          {/* <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
}
