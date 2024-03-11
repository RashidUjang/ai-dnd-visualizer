import { useEffect, useRef, useState } from "react";

const useRecordVoice = () => {
  const [isRecording, setIsRecording] = useState<boolean>();
  const [recording, setRecording] = useState<any>(new Blob([]));
  const [mediaRecorderInstance, setMediaRecorderInstance] =
    useState<MediaRecorder>();
  // TODO: Correct typing
  const chunksRef = useRef<any>([]);

  const initializeMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder: MediaRecorder = new MediaRecorder(stream);

    // TODO: Correct typing
    mediaRecorder.onstart = () => {
      chunksRef.current = [];
    };
    mediaRecorder.ondataavailable = (ev: BlobEvent) => {
      chunksRef.current.push(ev.data);
    };
    mediaRecorder.onstop = () => {      
      const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
      console.log("🚀 ~ initializeMediaRecorder ~ audioBlob:", audioBlob)

      setRecording(audioBlob);
    };

    setMediaRecorderInstance(mediaRecorder);
  };

  useEffect(() => {
    const initializeStream = async () => {
      if (typeof window !== undefined) {
        // Promps a user to
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        initializeMediaRecorder(mediaStream);
      }
    };

    initializeStream();
  }, []);

  const startRecording = () => {
    if (mediaRecorderInstance) {
      mediaRecorderInstance.start();
      setIsRecording(true);
    }
  };
  const stopRecording = () => {
    if (mediaRecorderInstance) {
      mediaRecorderInstance.stop();
      setIsRecording(false);
    }
  };

  return { recording, isRecording, startRecording, stopRecording };
};

export default useRecordVoice;
