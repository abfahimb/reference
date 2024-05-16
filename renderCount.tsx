  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    console.log(`Render Count: ${renderCount}`);
  }, [renderCount]);

onLoad={() => {
          setTimeout(() => {
            setPngFound(true);
            setIsLoading(false);
          }, 2000);
          console.log('ami found')
          setRenderCount((prevCount) => prevCount + 1);
        }}
